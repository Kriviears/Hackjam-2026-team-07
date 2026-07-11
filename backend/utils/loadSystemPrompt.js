const fs = require('fs');
const path = require('path');

const SYSTEM_PROMPT_PATH = path.join(__dirname, '..', 'promts', 'onboarding.system.md');

const loadSystemPrompt = () => fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8');

module.exports = { loadSystemPrompt };
