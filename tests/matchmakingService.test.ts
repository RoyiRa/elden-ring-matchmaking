import { matchmakingService } from '../src/services/matchmakingService';
import { test, expect } from '@playwright/test';

beforeEach(() => {
  // @ts-ignore – clear private queue between tests
  matchmakingService['waitingPlayers'] = [];
});

const makePrefs = (
  id: string,
  platform: 'ps' | 'xbox' | 'pc',
  bosses: string[],
  chars: string[]
) => ({ userId: id, platform, bosses, characters: chars });

test('forms a party when composition is possible', async () => {
  const p1 = makePrefs('A', 'pc', [], ['Executor', 'Revenant']);
  const p2 = makePrefs('B', 'pc', [], ['Raider']);
  const p3 = makePrefs('C', 'pc', [], ['Guardian', 'Wylder']);

  // enqueue players in any order
  const r1 = await matchmakingService.matchPlayers(p1.userId, ...Object.values(p1).slice(1));
  const r2 = await matchmakingService.matchPlayers(p2.userId, ...Object.values(p2).slice(1));
  const r3 = await matchmakingService.matchPlayers(p3.userId, ...Object.values(p3).slice(1));

  const finished = [r1, r2, r3].find(r => r.success)!;
  expect(finished.participants.sort()).toEqual(['A', 'B', 'C']);
  expect(Object.values(finished.assignedCharacters).sort()).toEqual(
    ['Executor', 'Raider', 'Guardian'].sort()
  );
});

test('does NOT form party across different platforms', async () => {
  await matchmakingService.matchPlayers('A', 'pc', [], ['Executor']);
  const r = await matchmakingService.matchPlayers('B', 'xbox', [], ['Raider']);
  expect(r.success).toBeFalsy();
});

test('3 users can form a party', async ({ browser }) => {
  // Open 3 isolated browser contexts (like 3 users)
  const ctxs = await Promise.all([1,2,3].map(()=>browser.newContext()));
  const pages = await Promise.all(ctxs.map(c=>c.newPage()));
  for (const page of pages) await page.goto('http://localhost:3000/expeditions');

  // Select platform
  for (const page of pages) await page.click('text=PC');

  // Select bosses/characters (adjust selectors as needed)
  await pages[0].click('text=Executor');
  await pages[1].click('text=Raider');
  await pages[2].click('text=Guardian');

  for (const page of pages) await page.click('text=Generate Password');

  // Wait for match found
  for (const page of pages) {
    await page.waitForURL('**/matchfound');
    const yourChar = await page.textContent('h3:has-text(\"Your Character\") + p');
    expect(['Executor','Raider','Guardian']).toContain(yourChar?.trim());
  }
}); 