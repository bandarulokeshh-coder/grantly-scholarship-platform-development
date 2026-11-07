import { isoDaysFromToday } from "@/lib/dates";
import { ALL_CATEGORIES } from "@/types";
import type { Category, Scholarship } from "@/types";

/**
 * SAMPLE DATA FOR DEMONSTRATION.
 * Scheme names and amounts are illustrative and modelled on well-known Indian
 * scholarship programmes. Every link points at the official portal home page.
 * Deadlines are generated relative to today so the demo never goes stale.
 */

const DOC = {
  income: "Income certificate",
  marksheet: "Last qualifying marksheet",
  aadhaar: "Aadhaar card",
  bank: "Bank passbook (student account)",
  bonafide: "Bonafide certificate from institute",
  caste: "Caste / community certificate",
  domicile: "Domicile certificate",
  photo: "Passport-size photograph",
  admission: "Admission or fee receipt",
  disability: "Disability certificate (UDID)",
  gap: "Gap year declaration",
  recommendation: "Recommendation letter",
  essay: "Statement of purpose (300 words)",
  bankStatement: "Parent's bank statement",
} as const;

const standardDocuments = [
  DOC.aadhaar,
  DOC.income,
  DOC.marksheet,
  DOC.bank,
  DOC.bonafide,
];

const reservedDocuments = [...standardDocuments, DOC.caste];

function portalSteps(portal: string): string[] {
  return [
    `Create a student login on ${portal} using your mobile number and Aadhaar.`,
    "Fill in your personal, academic and bank details exactly as printed on your documents.",
    "Upload clear scans or photos of every required document.",
    "Submit before the deadline and save the application number you receive.",
    "Ask your institute to verify the application, then check the portal for status updates.",
  ];
}

function privateSteps(portal: string): string[] {
  return [
    `Open the ${portal} scholarship page and read the current selection criteria.`,
    "Create an account and complete the application form in one sitting if you can.",
    "Upload your documents and write the short statement about your goals.",
    "Submit before the deadline and note the reference number in Grantly.",
    "Shortlisted students are usually contacted by email, so keep your inbox checked.",
  ];
}

interface ScholarshipSeed extends Omit<Scholarship, "deadline"> {
  deadlineOffset: number;
}

const seeds: ScholarshipSeed[] = [
  {
    id: "central-sector-scholarship",
    name: "Central Sector Scheme of Scholarship",
    provider: "Ministry of Education, Government of India",
    providerType: "National",
    amount: 20000,
    deadlineOffset: 24,
    level: ["undergraduate", "postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 450000 },
    documents: [...standardDocuments, DOC.domicile],
    steps: portalSteps("the National Scholarship Portal"),
    summary:
      "A yearly grant for students who scored in the top 20% of their Class 12 board and are now studying a regular degree. Money is paid directly to your bank account for every year of study.",
    link: "https://www.scholarships.gov.in",
  },
  {
    id: "post-matric-sc",
    name: "Post Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    providerType: "National",
    amount: 23000,
    deadlineOffset: 38,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: ["sc"],
    eligibility: { maxIncome: 250000 },
    documents: reservedDocuments,
    steps: portalSteps("the National Scholarship Portal"),
    summary:
      "Covers tuition, maintenance and book costs for SC students in post-matric courses. Apply every year you are enrolled, even if you received it last year.",
    link: "https://www.scholarships.gov.in",
  },
  {
    id: "pre-matric-st",
    name: "Pre Matric Scholarship for ST Students",
    provider: "Ministry of Tribal Affairs",
    providerType: "National",
    amount: 9000,
    deadlineOffset: 12,
    level: ["school"],
    category: ["st"],
    eligibility: { maxIncome: 250000 },
    documents: [DOC.aadhaar, DOC.income, DOC.caste, DOC.bank, DOC.photo],
    steps: portalSteps("the National Scholarship Portal"),
    summary:
      "Monthly support for ST students in Class 9 and 10, plus a book grant. Your school usually helps with the form, so ask your class teacher early.",
    link: "https://www.scholarships.gov.in",
  },
  {
    id: "pm-yasasvi",
    name: "PM YASASVI Entrance Scholarship",
    provider: "Ministry of Social Justice & Empowerment",
    providerType: "National",
    amount: 75000,
    deadlineOffset: 19,
    level: ["school"],
    category: ["obc", "ews", "general"],
    eligibility: { maxIncome: 250000 },
    documents: [DOC.aadhaar, DOC.income, DOC.caste, DOC.marksheet, DOC.bank, DOC.photo],
    steps: portalSteps("the National Scholarship Portal"),
    summary:
      "An entrance-test based scholarship for OBC, EBC and DNT students entering Class 9 or 11. Selection depends on the YET exam, and the award supports you through school.",
    link: "https://www.scholarships.gov.in",
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls",
    provider: "All India Council for Technical Education",
    providerType: "National",
    amount: 50000,
    deadlineOffset: 31,
    level: ["undergraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: {
      maxIncome: 800000,
      gender: "female",
      courses: ["engineering", "technology", "diploma", "architecture"],
    },
    documents: [DOC.aadhaar, DOC.income, DOC.admission, DOC.marksheet, DOC.bank],
    steps: portalSteps("the AICTE scholarship portal"),
    summary:
      "₹50,000 a year for girls in AICTE-approved technical programmes, with two girls supported per institute per year. One award covers tuition and books for the full course.",
    link: "https://www.aicte-india.org",
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship",
    provider: "All India Council for Technical Education",
    providerType: "National",
    amount: 50000,
    deadlineOffset: 36,
    level: ["undergraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: {
      maxIncome: 800000,
      courses: ["engineering", "technology", "diploma", "architecture"],
    },
    documents: [DOC.aadhaar, DOC.income, DOC.disability, DOC.admission, DOC.bank],
    steps: portalSteps("the AICTE scholarship portal"),
    summary:
      "Support for students with a disability of 40% or more studying in an AICTE-approved technical institute. Covers tuition and other study costs each year.",
    link: "https://www.aicte-india.org",
  },
  {
    id: "ugc-ishan-uday",
    name: "UGC Ishan Uday Scholarship for North East",
    provider: "University Grants Commission",
    providerType: "National",
    amount: 7800,
    deadlineOffset: 45,
    level: ["undergraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: {
      maxIncome: 450000,
      states: [
        "Arunachal Pradesh",
        "Assam",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Sikkim",
        "Tripura",
      ],
    },
    documents: standardDocuments,
    steps: portalSteps("the UGC scholarship portal"),
    summary:
      "A monthly grant for North East students in their first undergraduate degree. It is paid for the full length of the course, so keep the application renewed each year.",
    link: "https://www.ugc.gov.in",
  },
  {
    id: "ugc-single-girl-child",
    name: "UGC Single Girl Child Scholarship",
    provider: "University Grants Commission",
    providerType: "National",
    amount: 36200,
    deadlineOffset: 52,
    level: ["postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { gender: "female" },
    documents: [DOC.aadhaar, DOC.marksheet, DOC.admission, DOC.bank, DOC.gap],
    steps: portalSteps("the UGC scholarship portal"),
    summary:
      "A scholarship for the only girl child in a family pursuing a postgraduate degree. It rewards academic performance and covers monthly support for two years.",
    link: "https://www.ugc.gov.in",
  },
  {
    id: "inspire-she",
    name: "INSPIRE Scholarship for Higher Education",
    provider: "Department of Science & Technology",
    providerType: "National",
    amount: 80000,
    deadlineOffset: 29,
    level: ["undergraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: {
      courses: ["science", "physics", "chemistry", "mathematics", "biology", "statistics"],
    },
    documents: [DOC.aadhaar, DOC.marksheet, DOC.admission, DOC.bank],
    steps: portalSteps("the INSPIRE portal"),
    summary:
      "₹80,000 a year for talented students studying natural science at the undergraduate level. Includes a summer research project grant if you continue in science.",
    link: "https://online-inspire.gov.in",
  },
  {
    id: "mahadbt-mjp",
    name: "Mahatma Jyotiba Phule Scholarship",
    provider: "Government of Maharashtra",
    providerType: "State",
    amount: 25000,
    deadlineOffset: 9,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 800000, states: ["Maharashtra"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the MahaDBT portal"),
    summary:
      "Maharashtra's main scholarship for college students, covering tuition and exam fees for eligible families. One MahaDBT profile lets you apply for several state schemes.",
    link: "https://mahadbt.maharashtra.gov.in",
  },
  {
    id: "karnataka-ssp",
    name: "Karnataka SSP Post Matric Scholarship",
    provider: "Government of Karnataka",
    providerType: "State",
    amount: 18000,
    deadlineOffset: 15,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 250000, states: ["Karnataka"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the State Scholarship Portal"),
    summary:
      "Fee and maintenance support for Karnataka students in post-matric courses. Your college verifies the application on the same portal.",
    link: "https://ssp.postmatric.karnataka.gov.in",
  },
  {
    id: "kerala-egrantz",
    name: "e-Grantz Post Matric Scholarship",
    provider: "Government of Kerala",
    providerType: "State",
    amount: 20000,
    deadlineOffset: 22,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 250000, states: ["Kerala"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the e-Grantz portal"),
    summary:
      "Kerala's single window for post-matric scholarships, including fee concessions and hostel support. Applications are normally routed through your college.",
    link: "https://egrantz.kerala.gov.in",
  },
  {
    id: "up-scholarship",
    name: "UP Pre & Post Matric Scholarship",
    provider: "Government of Uttar Pradesh",
    providerType: "State",
    amount: 15000,
    deadlineOffset: 27,
    level: ["school", "undergraduate", "postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 200000, states: ["Uttar Pradesh"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the UP Scholarship portal"),
    summary:
      "Uttar Pradesh supports students from Class 9 through postgraduate study with fee and maintenance grants. Renew your registration every year on the same portal.",
    link: "https://scholarship.up.gov.in",
  },
  {
    id: "wb-svmcm",
    name: "Swami Vivekananda Merit-cum-Means Scholarship",
    provider: "Government of West Bengal",
    providerType: "State",
    amount: 60000,
    deadlineOffset: 34,
    level: ["undergraduate", "postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 250000, states: ["West Bengal"] },
    documents: [DOC.aadhaar, DOC.income, DOC.marksheet, DOC.bank, DOC.domicile],
    steps: portalSteps("the SVMCM portal"),
    summary:
      "A merit-cum-means award for West Bengal students with strong marks and limited family income. Monthly payments continue as long as you pass each semester.",
    link: "https://svmcm.wb.gov.in",
  },
  {
    id: "telangana-epass",
    name: "Telangana ePASS Post Matric Scholarship",
    provider: "Government of Telangana",
    providerType: "State",
    amount: 22000,
    deadlineOffset: 41,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 200000, states: ["Telangana"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the Telangana ePASS portal"),
    summary:
      "Tuition fee reimbursement plus maintenance for Telangana students in recognised colleges. Your college uploads the fee details, so confirm them before you submit.",
    link: "https://telanganaepass.cgg.gov.in",
  },
  {
    id: "gujarat-digital",
    name: "Digital Gujarat Post Matric Scholarship",
    provider: "Government of Gujarat",
    providerType: "State",
    amount: 17000,
    deadlineOffset: 48,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 250000, states: ["Gujarat"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the Digital Gujarat portal"),
    summary:
      "Gujarat's combined portal for education scholarships and fee assistance. One verified profile can be reused for state and central schemes.",
    link: "https://www.digitalgujarat.gov.in",
  },
  {
    id: "rajasthan-sje",
    name: "Rajasthan SJE Post Matric Scholarship",
    provider: "Government of Rajasthan",
    providerType: "State",
    amount: 16000,
    deadlineOffset: 55,
    level: ["undergraduate", "postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 250000, states: ["Rajasthan"] },
    documents: [...reservedDocuments, DOC.domicile, DOC.bankStatement],
    steps: portalSteps("the Rajasthan SJE portal"),
    summary:
      "Post-matric support for students from Rajasthan, covering maintenance and non-refundable fees. Keep your Jan Aadhaar details handy while applying.",
    link: "https://sje.rajasthan.gov.in",
  },
  {
    id: "tn-post-matric",
    name: "Tamil Nadu Post Matric Scholarship",
    provider: "Government of Tamil Nadu",
    providerType: "State",
    amount: 14000,
    deadlineOffset: 3,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: ["obc", "sc", "st", "minority", "ews"],
    eligibility: { maxIncome: 250000, states: ["Tamil Nadu"] },
    documents: [...reservedDocuments, DOC.domicile],
    steps: portalSteps("the Tamil Nadu e-Sevai portal"),
    summary:
      "Fee assistance for BC, MBC, SC, ST and minority students in Tamil Nadu colleges. Apply through your college office, which forwards verified applications.",
    link: "https://www.tn.gov.in",
  },
  {
    id: "punjab-sc-post-matric",
    name: "Punjab Post Matric Scholarship for SC Students",
    provider: "Government of Punjab",
    providerType: "State",
    amount: 21000,
    deadlineOffset: 17,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: ["sc"],
    eligibility: { maxIncome: 250000, states: ["Punjab"] },
    documents: reservedDocuments,
    steps: portalSteps("the Punjab scholarship portal"),
    summary:
      "Full tuition support for SC students from Punjab in government and recognised private institutes. Also includes a maintenance allowance for hostellers.",
    link: "https://punjab.gov.in",
  },
  {
    id: "delhi-merit",
    name: "Delhi Higher Education Merit Scholarship",
    provider: "Government of NCT of Delhi",
    providerType: "State",
    amount: 25000,
    deadlineOffset: 60,
    level: ["undergraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 600000, states: ["Delhi", "Chandigarh"] },
    documents: [DOC.aadhaar, DOC.income, DOC.marksheet, DOC.admission, DOC.domicile],
    steps: portalSteps("the Delhi e-district portal"),
    summary:
      "Merit support for Delhi students in recognised undergraduate programmes. Awarded for the first year and renewable with consistent academic progress.",
    link: "https://delhi.gov.in",
  },
  {
    id: "reliance-foundation-ug",
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    providerType: "Private",
    amount: 200000,
    deadlineOffset: 6,
    level: ["undergraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: {
      maxIncome: 1500000,
      courses: ["engineering", "science", "commerce", "arts", "medicine", "law", "management"],
    },
    documents: [
      DOC.aadhaar,
      DOC.income,
      DOC.marksheet,
      DOC.admission,
      DOC.essay,
      DOC.recommendation,
    ],
    steps: privateSteps("Reliance Foundation"),
    summary:
      "Up to ₹2 lakh of total support for first-year undergraduates with academic promise and financial need. Includes mentoring and learning opportunities beyond the money.",
    link: "https://www.reliancefoundation.org",
  },
  {
    id: "sitaram-jindal",
    name: "Sitaram Jindal Foundation Scholarship",
    provider: "Sitaram Jindal Foundation",
    providerType: "Private",
    amount: 30000,
    deadlineOffset: 44,
    level: ["school", "undergraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 600000 },
    documents: [DOC.aadhaar, DOC.income, DOC.marksheet, DOC.bank, DOC.bonafide],
    steps: privateSteps("the Sitaram Jindal Foundation"),
    summary:
      "A monthly scholarship for students from Class 11 upward with good marks and limited family income. Application is by post or through the foundation's form.",
    link: "https://www.sitaramjindalfoundation.org",
  },
  {
    id: "vidyasaarathi",
    name: "Vidyasaarathi Education Scholarship",
    provider: "Vidyasaarathi (NSDL)",
    providerType: "Private",
    amount: 50000,
    deadlineOffset: 50,
    level: ["undergraduate", "postgraduate", "diploma"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 1000000 },
    documents: [DOC.aadhaar, DOC.income, DOC.marksheet, DOC.admission, DOC.bank],
    steps: privateSteps("Vidyasaarathi"),
    summary:
      "A single place to apply for scholarships funded by companies and trusts. You create one profile and the portal shows schemes that fit your course and income.",
    link: "https://www.vidyasaarathi.co.in",
  },
  {
    id: "jn-tata-endowment",
    name: "JN Tata Endowment Loan Scholarship",
    provider: "JN Tata Endowment",
    providerType: "Private",
    amount: 100000,
    deadlineOffset: 57,
    level: ["postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { courses: ["engineering", "science", "management", "economics", "law"] },
    documents: [
      DOC.aadhaar,
      DOC.marksheet,
      DOC.admission,
      DOC.recommendation,
      DOC.essay,
      DOC.gap,
    ],
    steps: privateSteps("the JN Tata Endowment"),
    summary:
      "A loan scholarship for Indian students starting postgraduate study, awarded on merit. Repayment is interest-free and starts only after your course ends.",
    link: "https://www.jntataendowment.org",
  },
  {
    id: "tata-trusts-grant",
    name: "Tata Trusts Education Grant",
    provider: "Tata Trusts",
    providerType: "Private",
    amount: 75000,
    deadlineOffset: 21,
    level: ["undergraduate", "postgraduate"],
    category: [...ALL_CATEGORIES],
    eligibility: { maxIncome: 800000, gender: "female" },
    documents: [DOC.aadhaar, DOC.income, DOC.marksheet, DOC.admission, DOC.bank, DOC.essay],
    steps: privateSteps("Tata Trusts"),
    summary:
      "Flexible grant support for young women whose education is at risk because of family finances. Applications are reviewed by a trust committee every quarter.",
    link: "https://www.tatatrusts.org",
  },
];

export const scholarships: Scholarship[] = seeds.map(
  ({ deadlineOffset, ...scholarship }) => ({
    ...scholarship,
    category: [...scholarship.category] as Category[],
    deadline: isoDaysFromToday(deadlineOffset),
  }),
);

export const scholarshipCount = scholarships.length;

export function getScholarshipById(id: string): Scholarship | undefined {
  return scholarships.find((scholarship) => scholarship.id === id);
}
