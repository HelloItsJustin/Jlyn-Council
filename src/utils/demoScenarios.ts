import { DemoScenario } from './types';
import { encrypt } from './jlynCipher';

const generateScenario = (
  queryId: string,
  query: string,
  responses: Array<{ model: string; role: string; response: string; confidence: number }>,
  synthesis: string,
  consensusLevel: number,
  totalTime: number
): DemoScenario => {
  const queryEncryption = encrypt(query);

  const councilResponses = responses.map((r, index) => {
    const responseEncryption = encrypt(r.response);
    return {
      model: r.model,
      role: r.role,
      encrypted_response: responseEncryption.ciphertext,
      plaintext_response: r.response,
      confidence: r.confidence,
      timestamp: 1000 + index * 1500,
    };
  });

  const peerReviews = [
    {
      reviewer: 'Analyst',
      reviewed: 'Critic',
      encrypted_vote: encrypt('Quality: High').ciphertext,
      score: 92,
      timestamp: 5000,
    },
    {
      reviewer: 'Critic',
      reviewed: 'Synthesizer',
      encrypted_vote: encrypt('Clarity: Excellent').ciphertext,
      score: 88,
      timestamp: 5500,
    },
    {
      reviewer: 'Synthesizer',
      reviewed: 'Analyst',
      encrypted_vote: encrypt('Accuracy: Strong').ciphertext,
      score: 95,
      timestamp: 6000,
    },
  ];

  const synthesisEncryption = encrypt(synthesis);

  return {
    query_id: queryId,
    plaintext_query: query,
    encrypted_query: queryEncryption.ciphertext,
    jlyn_key: queryEncryption.key,
    council_responses: councilResponses,
    peer_reviews: peerReviews,
    encrypted_synthesis: synthesisEncryption.ciphertext,
    plaintext_synthesis: synthesis,
    consensus_level: consensusLevel,
    total_time_seconds: totalTime,
  };
};

export const demoScenarios: DemoScenario[] = [
  generateScenario(
    'quantum-computing',
    'Explain quantum computing in simple terms',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously through superposition. Unlike classical bits (0 or 1), qubits can be both at once, enabling parallel processing of vast possibilities. Entanglement links qubits so changing one instantly affects others, creating powerful computational networks.',
        confidence: 92,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'The explanation correctly identifies superposition and entanglement as core principles. However, it should clarify that measurement collapses superposition to classical states. The analogy of "checking all paths simultaneously" helps intuition. Accuracy is high but could benefit from real-world application examples.',
        confidence: 88,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Think of classical computers as reading a book one page at a time, while quantum computers can read all pages simultaneously. This "quantum parallelism" makes them exceptional at optimization, cryptography, and molecular simulation - problems with many possible solutions to explore at once.',
        confidence: 94,
      },
    ],
    'Quantum computing leverages quantum mechanics principles - superposition and entanglement - to process information differently than classical computers. Qubits can exist in multiple states simultaneously, enabling parallel exploration of solutions. When measured, they collapse to definite states, providing answers to complex problems in optimization, cryptography, and simulation that would take classical computers millennia to solve.',
    95,
    12.5
  ),

  generateScenario(
    'security-vuln',
    'Review this Python function for security vulnerabilities: def process(data): exec(data)',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'CRITICAL VULNERABILITY: exec() executes arbitrary code from user input. This is Remote Code Execution (RCE) - the most severe security flaw. An attacker can run any Python command: delete files, exfiltrate data, install malware, or compromise the entire system. Never use exec() on untrusted input under any circumstances.',
        confidence: 99,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'The analysis is accurate and appropriately urgent. This vulnerability receives a CVSS score of 10.0 (Critical). Even input validation cannot safely sanitize data for exec(). The recommendation to avoid exec() entirely is correct. Alternative approaches like whitelisted operations or sandboxed environments should be suggested.',
        confidence: 97,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'This code is equivalent to giving attackers full shell access. Safer alternatives: use ast.literal_eval() for data, JSON parsing for structured input, or match/case statements for commands. If dynamic execution is truly needed, use a restricted environment like RestrictedPython with strict whitelisting.',
        confidence: 98,
      },
    ],
    'This function contains a critical Remote Code Execution (RCE) vulnerability with maximum severity. Using exec() on user-supplied data allows attackers to execute arbitrary Python code with full application privileges. IMMEDIATE ACTION REQUIRED: Remove exec() entirely. Use safe alternatives like ast.literal_eval() for data parsing, JSON for structured input, or implement command whitelisting with strict validation. Never execute untrusted code.',
    98,
    10.2
  ),

  generateScenario(
    'jlyn-algorithm',
    'What makes the JLYN Algorithm different from AES encryption?',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'JLYN is a character substitution cipher with deterministic key-based shuffling, while AES is a block cipher using multiple rounds of substitution-permutation networks. AES operates on bytes with complex mathematical transformations (SubBytes, ShiftRows, MixColumns). JLYN maps characters directly via a star-pattern permutation, making it conceptually simpler but cryptographically weaker for production use.',
        confidence: 90,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'The comparison is technically accurate. Important distinctions: AES is a proven standard (NIST FIPS 197) with 128/192/256-bit keys and resistance to known attacks. JLYN is a demonstration cipher suitable for educational purposes and low-stakes encryption. AES provides confusion and diffusion through multiple rounds; JLYN relies on single-pass substitution.',
        confidence: 87,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Key differences: AES is battle-tested for securing sensitive data (banking, military, healthcare). JLYN demonstrates encryption principles with visual clarity - its star-pattern mapping makes the cipher comprehensible. Use AES for production; use JLYN for learning, demos, or scenarios where encryption transparency matters more than cryptographic strength.',
        confidence: 91,
      },
    ],
    'JLYN and AES serve different purposes: AES is an industry-standard block cipher using complex mathematical transformations across multiple rounds, designed for maximum security in production systems. JLYN is a character-substitution cipher with deterministic star-pattern mapping, designed for transparency and education. JLYN makes encryption visible and understandable, ideal for demonstrations. For protecting sensitive data, use AES. For teaching encryption concepts or transparent demonstrations, JLYN excels.',
    89,
    11.8
  ),

  generateScenario(
    'ai-haiku',
    'Write a haiku about artificial intelligence',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'Silicon neurons / Learning patterns in the dark / Wisdom without soul',
        confidence: 85,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'The haiku follows 5-7-5 structure correctly. "Silicon neurons" effectively bridges biological and digital intelligence. "Learning patterns in the dark" captures unsupervised learning elegantly. "Wisdom without soul" raises philosophical questions about consciousness. Strong imagery and adherence to form. Recommend this as the synthesis.',
        confidence: 91,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Electric minds think / Algorithms bloom like spring / Questions still remain',
        confidence: 88,
      },
    ],
    'Silicon neurons / Learning patterns in the dark / Wisdom without soul',
    91,
    9.5
  ),

  generateScenario(
    'startup-priority',
    'Should startups prioritize growth or profitability?',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'The answer depends on market conditions and funding environment. In bull markets with abundant capital, growth-first strategies work (Amazon, Uber model). In economic downturns or capital-scarce periods, profitability becomes essential for survival. The 2022-2023 tech correction showed dangers of pure growth focus: companies with unit economics survived.',
        confidence: 87,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'The analysis correctly identifies context-dependency but lacks nuance. Many successful startups pursue "default alive" - sustainable growth with path to profitability. Blitzscaling only works in winner-take-all markets. The question presents false dichotomy; optimal strategy often combines both: grow efficiently while maintaining unit economics.',
        confidence: 84,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Modern wisdom: "Grow profitably." Focus on unit economics first - ensure each customer generates positive margin. Then scale channels that work. Exception: network effect businesses (social, marketplaces) may need initial subsidy. Rule of thumb: can you 3x revenue without 3x costs? If no, fix unit economics before scaling.',
        confidence: 92,
      },
    ],
    'The growth vs. profitability debate is a false choice for most startups. The optimal approach is profitable growth: ensure strong unit economics (positive margin per customer), then scale efficiently. Exceptions exist for network-effect businesses requiring critical mass. In today\'s market, "default alive" startups with clear paths to profitability attract better talent, partnerships, and eventually better funding terms. Grow, but grow sustainably.',
    87,
    13.2
  ),

  generateScenario(
    'shakespeare-hemingway',
    'Compare Shakespeare and Hemingway writing styles',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'Shakespeare (1564-1616): Elizabethan verse, iambic pentameter, elaborate metaphors, wordplay, neologisms, elevated diction. Complex syntax, soliloquies, dramatic tension. Hemingway (1899-1961): 20th-century prose, short declarative sentences, sparse adjectives, "iceberg theory" (subtext), journalistic clarity. Minimalist, masculine, understated emotion.',
        confidence: 90,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'Accurate stylistic contrast. Should emphasize philosophical difference: Shakespeare explores language\'s expressive limits; Hemingway reduces language to essential truth. Shakespeare: "If music be the food of love, play on." Hemingway: "He loved her." Both masters, opposite approaches. The comparison captures technical differences well but could deepen thematic analysis.',
        confidence: 86,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Shakespeare paints with words; Hemingway carves with them. Shakespeare: ornate cathedral with soaring metaphors. Hemingway: steel bridge with no wasted beam. Shakespeare reveals through decoration; Hemingway reveals through omission. Both create profound emotional impact - one through abundance, one through absence. Masters of opposite techniques, equal in influence.',
        confidence: 93,
      },
    ],
    'Shakespeare and Hemingway represent opposite poles of literary expression. Shakespeare uses elaborate language, complex metaphors, and poetic structures to explore human nature through linguistic abundance. Hemingway employs radical minimalism, short sentences, and omission to create meaning through what\'s unsaid. Shakespeare: maximalist, ornate, theatrical. Hemingway: minimalist, sparse, journalistic. Despite opposite techniques, both achieve profound emotional impact and remain towering influences on literature.',
    89,
    12.7
  ),

  generateScenario(
    'hackathon-tips',
    'Best practices for hackathon presentations',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'Key elements: Start with the problem (30 seconds), demo the solution (60-90 seconds), explain technical highlights (30 seconds), end with impact (20 seconds). Total: 3-4 minutes max. Live demo > slides. Practice crash recovery. Judges value: clear problem-solution fit, working product, technical ambition, team chemistry. Avoid: reading slides, technical jargon, features without context.',
        confidence: 91,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'Solid structure but missing crucial element: storytelling. Best hackathon pitches frame technical work as narrative. "We noticed X problem, tried Y approach, discovered Z insight, built this solution." Also critical: rehearse timing religiously. Teams often run over, cutting their demo short. Pre-record backup demo video in case of technical failure.',
        confidence: 88,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Winning formula: Problem (relatable story) → Solution (live demo with wow moment) → Technical depth (one impressive detail) → Impact (quantifiable or emotional). Pro tips: start mid-action ("Watch this..."), use humor, make judges say "I want that." Energy matters - enthusiasm is contagious. End with memorable tagline. Most important: demo something that WORKS.',
        confidence: 94,
      },
    ],
    'Effective hackathon presentations follow a clear structure: Problem (30s relatable story) → Solution (90s live demo with wow moment) → Technical depth (30s impressive detail) → Impact (20s quantifiable result). Key principles: Live demo beats slides; show don\'t tell; practice crash recovery; avoid jargon; demonstrate working functionality. Judges reward: clear problem-solution fit, technical ambition, presentation energy, and projects that actually work. Most crucial: rehearse timing to avoid cutting your demo short.',
    91,
    11.4
  ),

  generateScenario(
    'llm-hallucinations',
    'Explain LLM hallucinations and mitigation strategies',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'LLM hallucinations occur when models generate plausible but factually incorrect information. Root causes: training data gaps, pattern completion over accuracy, no ground truth verification, high temperature sampling amplifying randomness. Models predict likely next tokens, not truth. Hallucinations increase with: obscure topics, specific dates/numbers, complex reasoning chains, creative tasks.',
        confidence: 93,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'Accurate explanation of mechanisms. Should distinguish types: fabricated facts, logical inconsistencies, outdated information, misattributed sources. Mitigation coverage is strong but could emphasize emerging techniques: chain-of-thought verification, retrieval-augmented generation (RAG), model uncertainty quantification, and multi-model consensus (like this system).',
        confidence: 89,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Practical mitigation strategies: 1) RAG - ground responses in retrieved documents, 2) Lower temperature (0.3-0.5) for factual tasks, 3) Prompt engineering: "cite sources", "admit uncertainty", 4) Multi-model consensus, 5) Human-in-loop for critical decisions, 6) Fact-checking layers, 7) Fine-tuning on verified data. Best approach: combine multiple techniques.',
        confidence: 95,
      },
    ],
    'LLM hallucinations are plausible but incorrect outputs caused by models prioritizing pattern completion over factual accuracy. Root causes include training data limitations, probabilistic token prediction, and absence of ground truth verification. Mitigation strategies: 1) Retrieval-Augmented Generation (RAG) for factual grounding, 2) Lower temperature sampling (0.3-0.5), 3) Chain-of-thought reasoning with verification, 4) Multi-model consensus validation, 5) Explicit uncertainty acknowledgment in prompts, 6) Human review for critical applications. Most effective: combine multiple techniques.',
    92,
    13.1
  ),

  generateScenario(
    'e2e-encryption',
    'How does end-to-end encryption work?',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'End-to-end encryption (E2EE) ensures only communicating parties can read messages. Process: 1) Each user generates public-private key pair, 2) Alice encrypts message with Bob\'s public key, 3) Only Bob\'s private key can decrypt, 4) Server sees only ciphertext. Prevents intermediaries (ISPs, platforms, governments) from accessing content. Uses asymmetric cryptography (RSA, ECC) for key exchange, symmetric (AES) for message encryption.',
        confidence: 94,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'Technically accurate description of E2EE mechanisms. Should clarify: public keys are shared openly, private keys never leave devices. Good mention of hybrid approach (asymmetric + symmetric). Could expand on practical implementations: Signal Protocol, WhatsApp, iMessage. Important caveat: E2EE protects data in transit but not on compromised devices or through metadata analysis.',
        confidence: 90,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Think of E2EE as a lockbox only the recipient can open. You seal it with their unique lock (public key), mail it through untrusted services (internet), and only their key (private key) opens it. Even the mail carrier (service provider) can\'t peek inside. Real-world apps like Signal use this to protect billions of messages. Limitation: doesn\'t hide who talks to whom, just what they say.',
        confidence: 92,
      },
    ],
    'End-to-end encryption (E2EE) protects communication so only sender and recipient can read messages, excluding all intermediaries. How it works: users generate public-private key pairs; messages are encrypted with the recipient\'s public key and decrypted only by their private key. Modern systems use hybrid cryptography: asymmetric algorithms (RSA, ECC) for key exchange, symmetric algorithms (AES) for efficient message encryption. E2EE prevents service providers, ISPs, and attackers from accessing content. Used by Signal, WhatsApp, and iMessage. Note: protects content, not metadata like who communicates with whom.',
    92,
    12.3
  ),

  generateScenario(
    'multi-agent-limits',
    'What are the limitations of multi-agent AI systems?',
    [
      {
        model: 'Analyst',
        role: 'Technical Expert',
        response: 'Key limitations: 1) Computational cost multiplies with agents, 2) Consensus delays increase latency, 3) Disagreement resolution requires complex logic, 4) Training coordination is challenging, 5) Emergent behaviors may be unpredictable, 6) No guarantee of better accuracy (garbage in, garbage out across all agents), 7) Coordination overhead can negate benefits for simple tasks.',
        confidence: 91,
      },
      {
        model: 'Critic',
        role: 'Quality Reviewer',
        response: 'Comprehensive technical list. Should add: 8) Communication bottlenecks in large systems, 9) Difficulty in explaining decisions (XAI challenges), 10) Security concerns (one compromised agent affects all), 11) Diminishing returns beyond optimal agent count. The analysis correctly notes that multi-agent isn\'t always superior - simple queries don\'t benefit from council overhead.',
        confidence: 88,
      },
      {
        model: 'Synthesizer',
        role: 'Integration Specialist',
        response: 'Practical perspective: Multi-agent systems shine for complex, high-stakes decisions needing diverse expertise but struggle with speed, cost, and simplicity. Like asking three doctors for a diagnosis - better for cancer treatment, overkill for common cold. Real limitation often isn\'t technical but economic: 3x API calls = 3x cost. Best use cases: critical decisions, creative work needing perspectives, tasks benefiting from specialization.',
        confidence: 93,
      },
    ],
    'Multi-agent AI systems face several limitations: 1) Increased computational cost (N agents = N× API calls), 2) Higher latency due to coordination, 3) Complexity in conflict resolution, 4) Unpredictable emergent behaviors, 5) Not always more accurate (shared biases or errors), 6) Communication overhead, 7) Difficult to explain decisions, 8) Security vulnerabilities if one agent is compromised, 9) Diminishing returns beyond optimal agent count. Key insight: multi-agent approaches excel for complex, high-stakes tasks requiring diverse expertise but add unnecessary overhead for simple queries. Choose architecture based on task complexity and accuracy requirements.',
    90,
    13.8
  ),
];
