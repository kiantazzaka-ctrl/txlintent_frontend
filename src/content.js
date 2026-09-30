/* All product copy is sourced from the Transaction Intent Security Layer brief. */

export const BRAND = 'TxIntent';
export const PRODUCT = 'Transaction Intent Security Layer';

export const NAV = [
  { label: 'Demo', href: '#demo', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Flow', href: '#flow' },
  { label: 'FAQs', href: '#faqs' },
];

export const HERO = {
  sub: 'A security layer that shows users exactly what an onchain transaction intends to do before they approve it.',
  cta: 'Preview a Transaction',
};

export const ENGINE = {
  title: 'Intent Engine',
  body: 'Wallets often show transaction data without explaining its real-world effect. The intent engine converts raw calldata and contract interactions into a clear, human-readable action summary — and outputs structured data so wallets and apps can render their own UI.',
  stages: ['Transaction', 'Decoder', 'Intent Engine', 'Security Rules', 'Result'],
};

export const FLOW = {
  title: 'Core Flow',
  body: 'The user submits or previews a transaction. The system decodes it, identifies the intended actions, explains them in plain language and checks them against security rules.',
  cards: [
    { num: '01', title: 'Decode', desc: 'Decodes the transaction and every associated contract call' },
    { num: '02', title: 'Identify', desc: 'Identifies the intended actions behind the calldata' },
    { num: '03', title: 'Translate', desc: 'Converts those actions into plain-language intent' },
    { num: '04', title: 'Check', desc: 'Checks the transaction against security rules' },
  ],
};

export const DEMO = {
  title: `${BRAND} Demo`,
  sub: 'Paste calldata or pick a sample to see the approval screen a user would get.',
};

export const BENTO = {
  title: ['Decode. Explain.', 'Protect.'],
  body: "Not a replacement for wallet simulation. It's the interpretation and security layer sitting between raw transaction data and the user's approval decision.",
  slides: [
    { title: 'Transaction Decoded', sub: 'Raw calldata and contract calls, parsed.' },
    { title: 'Intent Identified', sub: 'The intended actions, named in plain language.' },
    { title: 'Rules Checked', sub: 'Security rules applied before anything is signed.' },
    { title: 'Approval Ready', sub: 'A concise screen with the intent and warnings.' },
  ],
  right: {
    lines: ['Built for wallets.', 'Designed for apps.', 'Powered by intent.'],
    body: 'One API endpoint returns structured intent your interface can render.',
    cta: 'Request API Access',
  },
};

export const FEATURES = {
  title: 'Features',
  body: 'The first version focuses on EVM transactions: decoding, detection and human-readable intent summaries with basic risk flags.',
  tabs: ['Decoding', 'Transfers', 'Permissions', 'Risk Flags', 'Integration'],
};

export const SEE = {
  title: 'What Users See',
  body: 'Before signing, the system produces a structured explanation of what will happen.',
  items: [
    { icon: 'Coins', title: 'Assets That Move', desc: 'Exactly which tokens leave the wallet, and how much.' },
    { icon: 'Recipient', title: 'Who Receives Them', desc: 'Every recipient identified and labelled where known.' },
    { icon: 'Key', title: 'Permission Changes', desc: 'Approvals, allowances and operator rights that change.' },
    { icon: 'Layers', title: 'Contracts Involved', desc: 'Each contract and function the transaction touches.' },
    { icon: 'Undo', title: 'Reversibility', desc: 'Whether the action can be undone, and how.' },
    { icon: 'Radar', title: 'High-Risk Behavior', desc: 'Potentially unusual or high-risk behaviors, flagged.' },
  ],
};

export const WHY = {
  title: `Why ${BRAND}`,
  copy: "Don't just show users what they're signing. Show them what it actually does. Instead of approve(address, 0xffff…), a user reads: you're giving this contract permission to spend your USDC.",
  bg: `${BRAND.toUpperCase()} DECODES RAW CALLDATA, IDENTIFIES THE INTENDED ACTIONS, CHECKS THEM AGAINST SECURITY RULES AND SHOWS WHAT A TRANSACTION ACTUALLY DOES BEFORE ANYONE SIGNS IT. `,
};

export const BUILDERS = {
  title: ['Built For', 'Builders'],
  body: 'One API endpoint for wallets, apps and interfaces. The engine returns structured data, so every team can render intent in its own UI.',
  cards: [
    { kind: 'wallet', bg: '#3b9a66', pal: ['#0f1512', '#1d2a22', '#2f4a39', '#8fd0a8', '#e9f5ee'], q: 'Show a concise approval screen with the detected intent and warnings before every signature.', who: 'For wallets', big: 'API', lbl: 'Endpoint for wallets' },
    { kind: 'app', bg: '#0c0b0b', pal: ['#1d1a19', '#3a302c', '#7a5a3f', '#d6a36b', '#f6e3c8'], q: 'Explain every contract interaction your app requests in plain language users understand.', who: 'For apps', big: 'JSON', lbl: 'Structured intent output' },
    { kind: 'code', bg: '#bdbab6', pal: ['#2b2a29', '#595755', '#8b8886', '#e6e4e1', '#ffffff'], q: 'Render intent, recipients, permission changes and risk flags in any interface you build.', who: 'For interfaces', big: 'EVM', lbl: 'Transaction decoding' },
  ],
};

export const FAQS = {
  title: 'FAQs',
  body: `Answers to common questions about the ${PRODUCT}, how it works, and how it fits into wallets and apps.`,
  items: [
    { q: `What is the ${PRODUCT}?`, a: 'An intent interpreter that converts raw transaction calldata and contract interactions into a clear, human-readable action summary, so users see exactly what a transaction intends to do before they approve it.' },
    { q: 'Does it replace wallet simulation?', a: "No. It is the interpretation and security layer sitting between raw transaction data and the user's approval decision." },
    { q: 'What does the first version cover?', a: 'EVM transaction decoding, contract and function identification, token transfer detection, approval and allowance detection, permission-change detection, recipient identification, human-readable intent summaries and basic risk flags.' },
    { q: 'What does a user see before signing?', a: 'What will happen, which assets will move, who receives them, which permissions change, what contracts are involved, whether the action is reversible and any potentially unusual or high-risk behaviors.' },
    { q: 'How do wallets and apps integrate it?', a: 'Through an API endpoint. The intent engine outputs structured data — intent, asset, spender, amount, risk flags and a summary — so wallets and applications can render their own UI.' },
    { q: 'What comes after the MVP?', a: 'Multi-call transactions, token swaps, lending actions, NFT permissions, smart-account operations, agent-initiated transactions, RWA/Stock Token interactions, delegated permissions and automated transaction policies.' },
  ],
};

export const ROADMAP = {
  title: 'Roadmap',
  body: 'From simple transaction interpretation toward a broader intent security standard.',
  cards: [
    { art: 'rose', title: 'Multi-call Transactions, Token Swaps & Lending Actions', tag: 'DeFi', when: 'Expansion' },
    { art: 'mosaic', title: 'NFT Permissions, Smart-account Operations & Delegated Permissions', tag: 'Permissions', when: 'Expansion' },
    { art: 'streaks', title: 'Agent-initiated Transactions, RWA/Stock Tokens & Automated Policies', tag: 'Automation', when: 'Expansion' },
  ],
};

export const ACCESS = {
  title: ['Know Before', 'You Sign'],
  body: 'Request access to the intent API for wallets, apps and interfaces.',
  placeholder: 'Enter Your Mail Address',
  cta: 'Request Access',
};

export const FOOTER = {
  body: `${PRODUCT}. Shows users exactly what an onchain transaction intends to do before they approve it.`,
  cols: [
    { title: 'Product', links: [['Demo', '#demo'], ['Features', '#features'], ['Core Flow', '#flow'], ['What Users See', '#see']] },
    { title: 'Resources', links: [['FAQs', '#faqs'], ['Roadmap', '#roadmap'], ['API Access', '#access'], ['Example Output', '#demo']] },
  ],
};
