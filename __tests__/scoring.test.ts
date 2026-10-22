import { scoreAndRankLeads, estimateContactTime } from '../lib/scoring';

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  stage: string;
  notes: string | null;
  lastContactDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
};

// Simple test framework
const results = {
  passed: 0,
  failed: 0,
  tests: [] as { name: string; passed: boolean; error?: string }[],
};

function describe(suiteName: string, fn: () => void) {
  console.log(`\n${suiteName}`);
  fn();
}

function test(testName: string, fn: () => void) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name: testName, passed: true });
    console.log(`  ✓ ${testName}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name: testName, passed: false, error: String(error) });
    console.log(`  ✗ ${testName}`);
    console.log(`    ${error}`);
  }
}

function expect(value: any) {
  return {
    toBe: (expected: any) => {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`);
      }
    },
    toEqual: (expected: any) => {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (value <= expected) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
    toMatch: (pattern: RegExp | string) => {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      if (!regex.test(value)) {
        throw new Error(`Expected ${value} to match ${pattern}`);
      }
    },
    toContain: (expected: string) => {
      if (!value.includes(expected)) {
        throw new Error(`Expected ${value} to contain ${expected}`);
      }
    },
    toBeTruthy: () => {
      if (!value) {
        throw new Error(`Expected ${value} to be truthy`);
      }
    },
  };
}

console.log('Running scoring logic tests...');

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const createLead = (overrides: Partial<Lead>): Lead => ({
  id: 'test-id',
  name: 'Test Lead',
  phone: '555-1234',
  email: 'test@example.com',
  source: 'Website',
  stage: 'new',
  notes: 'Test notes',
  lastContactDate: null,
  createdAt: now,
  updatedAt: now,
  userId: 'user-1',
  ...overrides,
});

describe('Lead Scoring Logic', () => {
  test('hot leads that went quiet should score highest', () => {
    const leads = [
      createLead({ id: '1', name: 'Hot Lead', stage: 'hot', lastContactDate: daysAgo(10) }),
      createLead({ id: '2', name: 'Warm Lead', stage: 'warm', lastContactDate: daysAgo(10) }),
      createLead({ id: '3', name: 'Cold Lead', stage: 'cold', lastContactDate: daysAgo(10) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].id).toBe('1');
    expect(scored[0].stage).toBe('hot');
    expect(scored[0].score).toBeGreaterThan(scored[1].score);
  });

  test('new leads should be prioritized within first day', () => {
    const leads = [
      createLead({ id: '1', name: 'New Today', stage: 'new', lastContactDate: daysAgo(0.5), createdAt: daysAgo(0.5) }),
      createLead({ id: '2', name: 'Nurture Old', stage: 'nurture', lastContactDate: daysAgo(90) }),
      createLead({ id: '3', name: 'Cold Old', stage: 'cold', lastContactDate: daysAgo(200) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].id).toBe('1');
    expect(scored[0].stage).toBe('new');
    expect(scored[0].reason).toContain('New lead');
  });

  test('qualified leads without recent contact should rank high', () => {
    const leads = [
      createLead({ id: '1', name: 'Qualified Quiet', stage: 'qualified', lastContactDate: daysAgo(9) }),
      createLead({ id: '2', name: 'Cold Forever', stage: 'cold', lastContactDate: daysAgo(200) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].id).toBe('1');
    expect(scored[0].priority).toMatch(/high|urgent/);
  });

  test('referrals should get bonus points', () => {
    const leads = [
      createLead({ id: '1', name: 'Referral Lead', stage: 'warm', source: 'Referral', lastContactDate: daysAgo(7) }),
      createLead({ id: '2', name: 'Website Lead', stage: 'warm', source: 'Website', lastContactDate: daysAgo(7) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].id).toBe('1');
    expect(scored[0].score).toBeGreaterThan(scored[1].score);
  });

  test('scoring assigns appropriate priority levels', () => {
    const leads = [
      createLead({ id: '1', name: 'Urgent', stage: 'hot', lastContactDate: daysAgo(10) }),
      createLead({ id: '2', name: 'High', stage: 'qualified', lastContactDate: daysAgo(8) }),
      createLead({ id: '3', name: 'Medium', stage: 'warm', lastContactDate: daysAgo(6) }),
      createLead({ id: '4', name: 'Low', stage: 'cold', lastContactDate: daysAgo(200) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].priority).toMatch(/urgent|high/);
    expect(scored[scored.length - 1].priority).toBe('low');
  });

  test('should limit results to requested count', () => {
    const leads = Array.from({ length: 20 }, (_, i) =>
      createLead({ id: `lead-${i}`, name: `Lead ${i}`, stage: 'warm' })
    );

    const top5 = scoreAndRankLeads(leads, 5);
    const top10 = scoreAndRankLeads(leads, 10);

    expect(top5.length).toBe(5);
    expect(top10.length).toBe(10);
  });

  test('should handle empty lead list', () => {
    const scored = scoreAndRankLeads([], 10);
    expect(scored).toEqual([]);
  });

  test('should generate meaningful reasons', () => {
    const leads = [
      createLead({ id: '1', stage: 'hot', lastContactDate: daysAgo(8) }),
      createLead({ id: '2', stage: 'new', lastContactDate: daysAgo(1) }),
      createLead({ id: '3', stage: 'nurture', lastContactDate: daysAgo(70) }),
    ];

    const scored = scoreAndRankLeads(leads, 10);

    expect(scored[0].reason).toBeTruthy();
    expect(scored[0].reason.length).toBeGreaterThan(0);
    expect(scored.every(lead => lead.reason)).toBe(true);
  });
});

describe('Time Estimation', () => {
  test('should estimate time correctly for various lead counts', () => {
    expect(estimateContactTime(10)).toBe('~12 min');
    expect(estimateContactTime(5)).toBe('~6 min');
    expect(estimateContactTime(50)).toBe('~1h');
    expect(estimateContactTime(75)).toBe('~1h 30m');
  });

  test('should handle edge cases', () => {
    expect(estimateContactTime(0)).toBe('~0 min');
    expect(estimateContactTime(1)).toBe('~2 min');
  });
});

console.log(`\n${'='.repeat(50)}`);
console.log(`Test Results: ${results.passed} passed, ${results.failed} failed`);
console.log('='.repeat(50));

process.exit(results.failed > 0 ? 1 : 0);
