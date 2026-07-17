/**
 * Citizen-facing sectors mapped 1:1 from OMB budget functions (Phase 1).
 *
 * Copy rules (docs/PRODUCT_SPEC.md §6.3, §8): plain English, say what each
 * bucket includes and excludes, never editorialize about waste or fraud.
 * Kept as code rather than a DB table for now — see docs/adr/0001.
 */

export interface Sector {
  slug: string;
  functionCode: string;
  name: string;
  description: string;
  includes: string;
  excludes: string;
}

export const SECTORS: Sector[] = [
  {
    slug: 'defense',
    functionCode: '050',
    name: 'National Defense',
    description:
      'The military: paying and equipping the armed forces, operating bases, and developing weapons systems.',
    includes:
      'Military pay, operations and maintenance, weapons procurement, defense research, nuclear weapons activities.',
    excludes:
      'Veterans benefits and VA hospitals (Veterans), foreign military aid (International Affairs).',
  },
  {
    slug: 'international-affairs',
    functionCode: '150',
    name: 'International Affairs',
    description:
      'Diplomacy and foreign assistance — a far smaller share of the budget than most people guess.',
    includes:
      'Embassies and the State Department, development and humanitarian aid, security assistance, international financial programs.',
    excludes: 'Military operations abroad (National Defense).',
  },
  {
    slug: 'science-space',
    functionCode: '250',
    name: 'Science, Space, and Technology',
    description: 'Basic research and the civilian space program.',
    includes: 'NASA, the National Science Foundation, general-purpose basic research.',
    excludes: 'Defense research (National Defense) and medical research (Health).',
  },
  {
    slug: 'energy',
    functionCode: '270',
    name: 'Energy',
    description:
      'Federal energy programs. Often small — and sometimes negative, because power sales and loan repayments count against spending.',
    includes: 'Energy supply programs, conservation, emergency preparedness, energy regulation.',
    excludes:
      'Environmental cleanup (Natural Resources), gasoline taxes (a receipt, not spending).',
  },
  {
    slug: 'environment',
    functionCode: '300',
    name: 'Natural Resources and Environment',
    description: 'Public lands, water, and pollution control.',
    includes:
      'Water projects, conservation and land management, national parks and recreation, pollution control and abatement.',
    excludes: 'Energy programs (Energy), farm conservation payments (Agriculture).',
  },
  {
    slug: 'agriculture',
    functionCode: '350',
    name: 'Agriculture',
    description: 'Support for farmers and agricultural research.',
    includes: 'Farm income stabilization, crop insurance, agricultural research and services.',
    excludes: 'Food stamps and school lunches (Income Security).',
  },
  {
    slug: 'commerce-housing',
    functionCode: '370',
    name: 'Commerce and Housing Credit',
    description:
      'Mortgage credit, deposit insurance, and business programs. This bucket swings sharply in crisis years, and can go negative when loans are repaid.',
    includes:
      'Mortgage credit programs, deposit insurance, the Postal Service, small business programs.',
    excludes: 'Housing assistance for low-income households (Income Security).',
  },
  {
    slug: 'transportation',
    functionCode: '400',
    name: 'Transportation',
    description:
      'Highways, transit, aviation, and waterways — much of it delivered as grants that states and cities spend.',
    includes:
      'Highway construction grants, mass transit, air traffic control and airports, water transportation.',
    excludes: 'State and local road budgets funded by their own taxes.',
  },
  {
    slug: 'community-development',
    functionCode: '450',
    name: 'Community and Regional Development',
    description: 'Neighborhood development and disaster response.',
    includes:
      'Community development block grants, regional development, disaster relief and flood insurance.',
    excludes: 'Housing vouchers (Income Security).',
  },
  {
    slug: 'education',
    functionCode: '500',
    name: 'Education, Training, and Social Services',
    description:
      'Federal education and job-training programs. Note: most K-12 school funding is state and local, not federal.',
    includes:
      'K-12 grants (like Title I and special education), Pell grants and student aid, job training, social services.',
    excludes:
      'The bulk of school budgets (state/local money), veterans education benefits (Veterans).',
  },
  {
    slug: 'health',
    functionCode: '550',
    name: 'Health',
    description: 'Federal health spending other than Medicare — Medicaid is the biggest piece.',
    includes:
      'Medicaid, children’s health insurance, NIH research, public health, food and drug safety.',
    excludes: 'Medicare (its own sector), VA hospitals (Veterans).',
  },
  {
    slug: 'medicare',
    functionCode: '570',
    name: 'Medicare',
    description: 'Health insurance for people 65 and older and some people with disabilities.',
    includes:
      'Hospital insurance, medical insurance, and prescription drug coverage benefits and administration.',
    excludes: 'Medicaid and other health programs (Health).',
  },
  {
    slug: 'income-security',
    functionCode: '600',
    name: 'Income Security',
    description: 'The safety net outside Social Security, plus federal employee retirement.',
    includes:
      'Unemployment insurance, SNAP (food stamps), housing assistance, federal employee retirement, disability programs.',
    excludes: 'Social Security (its own sector), Medicaid (Health).',
  },
  {
    slug: 'social-security',
    functionCode: '650',
    name: 'Social Security',
    description:
      'Monthly retirement, survivor, and disability benefits — the largest single program.',
    includes: 'Old-age, survivors, and disability insurance benefit payments and administration.',
    excludes: 'Medicare (its own sector), federal employee pensions (Income Security).',
  },
  {
    slug: 'veterans',
    functionCode: '700',
    name: 'Veterans Benefits and Services',
    description: 'What the country spends on those who served.',
    includes:
      'Disability compensation and pensions, VA hospitals and medical care, GI Bill education benefits, housing programs.',
    excludes: 'Active-duty military pay (National Defense).',
  },
  {
    slug: 'justice',
    functionCode: '750',
    name: 'Administration of Justice',
    description: 'Federal law enforcement, courts, and prisons.',
    includes:
      'The FBI and federal law enforcement, federal courts, federal prisons, grants to state and local justice systems.',
    excludes: 'State courts, local police departments (state/local budgets).',
  },
  {
    slug: 'general-government',
    functionCode: '800',
    name: 'General Government',
    description: 'The machinery of government itself.',
    includes:
      'Congress, the White House, tax collection (IRS), federal buildings and property, personnel management.',
    excludes: 'Agency-specific administration, which is counted inside each sector.',
  },
  {
    slug: 'net-interest',
    functionCode: '900',
    name: 'Net Interest',
    description: 'Interest paid on the national debt, net of interest the government earns.',
    includes: 'Interest on Treasury securities, minus interest received by government trust funds.',
    excludes: 'Repayment of the debt principal itself (not counted as spending).',
  },
  {
    slug: 'allowances',
    functionCode: '920',
    name: 'Allowances',
    description:
      'A bookkeeping placeholder for future policies in budget projections. Historical years are empty by design.',
    includes: 'Placeholder amounts for proposed policies not yet assigned to a function.',
    excludes: 'Any actual historical spending.',
  },
  {
    slug: 'offsetting-receipts',
    functionCode: '950',
    name: 'Undistributed Offsetting Receipts',
    description:
      'Money the government collects that is counted against total spending rather than as revenue — which is why this line is negative.',
    includes:
      'Agency payments into employee retirement funds, offshore drilling royalties, proceeds from asset sales.',
    excludes: 'Taxes and other governmental receipts (those are revenue).',
  },
];

export const sectorBySlug = new Map(SECTORS.map((s) => [s.slug, s]));
export const sectorByCode = new Map(SECTORS.map((s) => [s.functionCode, s]));
