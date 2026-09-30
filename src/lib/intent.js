/**
 * Transaction Intent engine (frontend reference implementation)
 *
 * Transaction → Decoder → Intent Engine → Security Rules → Human-readable Result
 *
 * Covers the MVP scope: EVM calldata decoding, contract/function identification,
 * token transfer detection, approval/allowance detection, permission-change
 * detection, recipient identification, plain-language summaries and basic risk
 * flags. Output is structured so any wallet or app can render its own UI.
 */

const MAX_UINT256 = (1n << 256n) - 1n;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/* ---------- Known contracts (demo registry) ---------- */
export const CONTRACTS = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { name: 'USD Coin', symbol: 'USDC', decimals: 6, kind: 'ERC-20' },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { name: 'Tether USD', symbol: 'USDT', decimals: 6, kind: 'ERC-20' },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18, kind: 'ERC-20' },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { name: 'Wrapped Ether', symbol: 'WETH', decimals: 18, kind: 'ERC-20' },
  '0x5a7e11c7a1b4c2d8e0f9a6b3c4d5e6f708192a3b': { name: 'Example Collection', symbol: 'EXC', kind: 'ERC-721' },
  '0x7d1f3c9b2a8e4f6d0c5b1a2e3f4d5c6b7a8e9f01': { name: 'Treasury Vault', kind: 'Ownable' },
};

/* Labels for counterparties (spenders, operators, recipients) */
export const LABELS = {
  '0x1111111254eeb25477b68fb85ed929f73a960582': 'Contract XYZ',
  '0x9f8e7d6c5b4a39281706f5e4d3c2b1a098765432': 'Marketplace Operator',
};

/* ---------- Function registry (selector → ABI) ---------- */
const FUNCTIONS = {
  '0x095ea7b3': { name: 'approve', sig: 'approve(address,uint256)', params: [['spender', 'address'], ['amount', 'uint256']] },
  '0xa9059cbb': { name: 'transfer', sig: 'transfer(address,uint256)', params: [['recipient', 'address'], ['amount', 'uint256']] },
  '0x23b872dd': { name: 'transferFrom', sig: 'transferFrom(address,address,uint256)', params: [['from', 'address'], ['to', 'address'], ['amount', 'uint256']] },
  '0xa22cb465': { name: 'setApprovalForAll', sig: 'setApprovalForAll(address,bool)', params: [['operator', 'address'], ['approved', 'bool']] },
  '0xf2fde38b': { name: 'transferOwnership', sig: 'transferOwnership(address)', params: [['newOwner', 'address']] },
};

const pad = (hex) => hex.replace(/^0x/, '').toLowerCase().padStart(64, '0');

/* ---------- Sample transactions shown in the demo ---------- */
export const SAMPLES = [
  {
    id: 'approval',
    label: 'Token approval',
    from: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db',
    to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    data: '0x095ea7b3' + pad('0x1111111254eeb25477b68fb85ed929f73a960582') + 'f'.repeat(64),
  },
  {
    id: 'transfer',
    label: 'Token transfer',
    from: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db',
    to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    data: '0xa9059cbb' + pad('0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be') + pad((250n * 10n ** 6n).toString(16)),
  },
  {
    id: 'operator',
    label: 'NFT operator',
    from: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db',
    to: '0x5a7e11c7a1b4c2d8e0f9a6b3c4d5e6f708192a3b',
    data: '0xa22cb465' + pad('0x9f8e7d6c5b4a39281706f5e4d3c2b1a098765432') + pad('1'),
  },
  {
    id: 'ownership',
    label: 'Ownership change',
    from: '0x4b20993bc481177ec7e8f571cecae8a9e22c02db',
    to: '0x7d1f3c9b2a8e4f6d0c5b1a2e3f4d5c6b7a8e9f01',
    data: '0xf2fde38b' + pad('0x8ba1f109551bd432803012645ac136ddd64dba72'),
  },
];

/* ---------- Helpers ---------- */
export const short = (a) => (a && a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);
const labelOf = (addr) => LABELS[addr] || CONTRACTS[addr]?.name || null;
const named = (addr) => (labelOf(addr) ? `${labelOf(addr)} (${short(addr)})` : short(addr));

function formatUnits(value, decimals = 18) {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = (value % base).toString().padStart(decimals, '0').replace(/0+$/, '').slice(0, 4);
  return `${whole.toLocaleString('en-US')}${frac ? '.' + frac : ''}`;
}

/* ---------- 1. Decoder ---------- */
export function decode({ to, data }) {
  const clean = (data || '').trim().toLowerCase().replace(/\s+/g, '');
  if (!/^0x[0-9a-f]*$/.test(clean)) throw new Error('Calldata must be a 0x-prefixed hex string.');
  if (clean.length < 10) throw new Error('Calldata is too short to contain a function selector.');
  const selector = clean.slice(0, 10);
  const body = clean.slice(10);
  const fn = FUNCTIONS[selector];
  const words = body.match(/.{1,64}/g) || [];
  if (!fn) return { selector, fn: null, args: {}, to: to.toLowerCase(), words };
  if (words.length < fn.params.length || words.slice(0, fn.params.length).some((w) => w.length !== 64)) {
    throw new Error(`Calldata for ${fn.sig} is incomplete: expected ${fn.params.length} 32-byte arguments.`);
  }
  const args = {};
  fn.params.forEach(([name, type], i) => {
    const w = words[i];
    if (type === 'address') args[name] = '0x' + w.slice(24);
    else if (type === 'uint256') args[name] = BigInt('0x' + w);
    else if (type === 'bool') args[name] = BigInt('0x' + w) !== 0n;
  });
  return { selector, fn, args, to: to.toLowerCase(), words };
}

/* ---------- 2. Intent engine + 3. Security rules ---------- */
export function interpret(tx) {
  const d = decode(tx);
  const contract = CONTRACTS[d.to];
  const token = contract && contract.kind === 'ERC-20' ? contract : null;
  const asset = contract?.symbol || contract?.name || 'Unknown asset';
  const flags = [];
  const warnings = [];
  const contracts = [{ role: 'Target', address: d.to, label: contract?.name || 'Unlabeled contract' }];
  if (!contract) flags.push({ code: 'UNLABELED_CONTRACT', level: 'medium' });

  let r;
  const fnName = d.fn?.name;

  if (fnName === 'approve') {
    const { spender, amount } = d.args;
    const unlimited = amount >= MAX_UINT256 / 2n;
    contracts.push({ role: 'Spender', address: spender, label: labelOf(spender) || 'Unlabeled' });
    if (amount === 0n) {
      r = {
        intent: 'TOKEN_APPROVAL_REVOKE',
        summary: `Remove this contract's permission to spend your ${asset}.`,
        rows: [['Action', 'Revoke allowance'], ['Asset', asset], ['Spender', named(spender)], ['Allowance after', '0']],
        reversible: 'Yes — a new approval can be granted later.',
        amount: '0',
      };
    } else {
      if (unlimited) {
        flags.push({ code: 'UNLIMITED_ALLOWANCE', level: 'high' });
        warnings.push({ level: 'high', text: 'This contract could spend all of your current and future ' + asset + '.' });
      }
      warnings.push({ level: 'info', text: 'Permission remains active until revoked.' });
      r = {
        intent: 'TOKEN_APPROVAL',
        summary: `You're giving this contract permission to spend your ${asset}.`,
        rows: [
          ['Allowance', unlimited ? 'Unlimited' : `${formatUnits(amount, token?.decimals)} ${asset}`],
          ['Contract', named(spender)],
          ['Assets moved now', 'None'],
          ['Permission change', `${asset} spending allowance`],
        ],
        reversible: 'Yes — until revoked by setting allowance to 0.',
        amount: unlimited ? 'UNLIMITED' : formatUnits(amount, token?.decimals),
        spender,
      };
    }
  } else if (fnName === 'transfer' || fnName === 'transferFrom') {
    const recipient = fnName === 'transfer' ? d.args.recipient : d.args.to;
    const amount = d.args.amount;
    const pretty = `${formatUnits(amount, token?.decimals)} ${asset}`;
    if (recipient === d.to) {
      flags.push({ code: 'TRANSFER_TO_TOKEN_CONTRACT', level: 'high' });
      warnings.push({ level: 'high', text: 'Tokens sent to the token contract itself are usually unrecoverable.' });
    }
    if (recipient === ZERO_ADDRESS) {
      flags.push({ code: 'TRANSFER_TO_ZERO_ADDRESS', level: 'high' });
      warnings.push({ level: 'high', text: 'The recipient is the zero address — these tokens would be lost.' });
    }
    if (amount === 0n) flags.push({ code: 'ZERO_VALUE_TRANSFER', level: 'medium' });
    warnings.push({ level: 'info', text: 'Token transfers are final once confirmed.' });
    contracts.push({ role: 'Recipient', address: recipient, label: labelOf(recipient) || 'External address' });
    r = {
      intent: 'TOKEN_TRANSFER',
      summary: `You're sending ${pretty} to ${short(recipient)}.`,
      rows: [
        ['Assets moving', pretty],
        ['Recipient', named(recipient)],
        ...(fnName === 'transferFrom' ? [['From', named(d.args.from)]] : []),
        ['Permission change', 'None'],
      ],
      reversible: 'No — transfers cannot be undone.',
      amount: formatUnits(amount, token?.decimals),
      recipient,
    };
  } else if (fnName === 'setApprovalForAll') {
    const { operator, approved } = d.args;
    contracts.push({ role: 'Operator', address: operator, label: labelOf(operator) || 'Unlabeled' });
    if (approved) {
      flags.push({ code: 'COLLECTION_WIDE_APPROVAL', level: 'high' });
      warnings.push({ level: 'high', text: `This operator could transfer every ${asset} item you own, now or later.` });
      warnings.push({ level: 'info', text: 'Permission remains active until revoked.' });
    }
    r = {
      intent: approved ? 'PERMISSION_GRANT' : 'PERMISSION_REVOKE',
      summary: approved
        ? `You're allowing this operator to transfer all of your ${contract?.name || 'collection'} NFTs.`
        : `Remove this operator's access to your ${contract?.name || 'collection'} NFTs.`,
      rows: [
        ['Scope', approved ? 'Entire collection' : 'Access removed'],
        ['Operator', named(operator)],
        ['Assets moved now', 'None'],
        ['Permission change', approved ? 'Operator approval: on' : 'Operator approval: off'],
      ],
      reversible: approved ? 'Yes — until revoked with setApprovalForAll(false).' : 'Yes — approval can be granted again.',
      operator,
    };
  } else if (fnName === 'transferOwnership') {
    const { newOwner } = d.args;
    flags.push({ code: 'OWNERSHIP_TRANSFER', level: 'high' });
    if (newOwner === ZERO_ADDRESS) {
      flags.push({ code: 'OWNERSHIP_TO_ZERO_ADDRESS', level: 'high' });
      warnings.push({ level: 'high', text: 'Ownership would be sent to the zero address and permanently lost.' });
    }
    warnings.push({ level: 'high', text: 'The new owner gains every admin permission of this contract.' });
    contracts.push({ role: 'New owner', address: newOwner, label: labelOf(newOwner) || 'External address' });
    r = {
      intent: 'OWNERSHIP_TRANSFER',
      summary: `You're handing full control of ${contract?.name || 'this contract'} to ${short(newOwner)}.`,
      rows: [
        ['Permission change', 'Contract owner'],
        ['New owner', named(newOwner)],
        ['Assets moved now', 'None'],
        ['Contract', named(d.to)],
      ],
      reversible: 'Only if the new owner transfers it back.',
      newOwner,
    };
  } else {
    flags.push({ code: 'UNRECOGNIZED_FUNCTION', level: 'high' });
    warnings.push({ level: 'high', text: `Function ${d.selector} could not be identified. Its effect cannot be explained.` });
    r = {
      intent: 'UNKNOWN',
      summary: 'This transaction calls a function that could not be identified.',
      rows: [['Selector', d.selector], ['Arguments', `${d.words.length} × 32 bytes`], ['Contract', named(d.to)]],
      reversible: 'Unknown.',
    };
  }

  const risk = flags.some((f) => f.level === 'high') ? 'high' : flags.length ? 'medium' : 'low';

  return {
    decoded: d,
    risk,
    flags,
    warnings,
    contracts,
    ...r,
    rows: [...r.rows, ['Reversible', r.reversible]],
    output: buildOutput(r, asset, flags),
  };
}

/* ---------- 4. Human-readable result as structured output ---------- */
function buildOutput(r, asset, flags) {
  const o = { intent: r.intent, asset };
  if (r.spender) o.spender = r.spender;
  if (r.recipient) o.recipient = r.recipient;
  if (r.operator) o.operator = r.operator;
  if (r.newOwner) o.new_owner = r.newOwner;
  if (r.amount) o.amount = r.amount;
  o.risk_flags = flags.map((f) => f.code);
  o.summary = r.intent === 'TOKEN_APPROVAL' ? `Approve this contract to spend your ${asset}.` : r.summary;
  return o;
}

export const FUNCTION_LIST = Object.values(FUNCTIONS).map((f) => f.sig);

/* Security rules evaluated by the MVP (shown in the demo) */
export const RULES = [
  'UNLIMITED_ALLOWANCE',
  'COLLECTION_WIDE_APPROVAL',
  'OWNERSHIP_TRANSFER',
  'TRANSFER_TO_TOKEN_CONTRACT',
  'TRANSFER_TO_ZERO_ADDRESS',
  'UNRECOGNIZED_FUNCTION',
];
