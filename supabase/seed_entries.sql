-- Seed / Upsert all 227 AiVerse entries into Supabase
-- Run this script in the Supabase Dashboard -> SQL Editor

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-V3', 'DeepSeek', 'Model', 'NLP', 'MIT', 2024, '671B (37B active)', 'DeepSeek''s flagship 671B Mixture-of-Experts (MoE) model with Multi-head Latent Attention (MLA), activating 37B params per token with industry-leading efficiency.', 'Multi-head Latent Attention (MLA) + DeepSeekMoE + FP8 Mixed Precision Training.', 'from openai import OpenAI
client = OpenAI(api_key="YOUR_KEY", base_url="https://api.deepseek.com")
response = client.chat.completions.create(
  model="deepseek-chat",
  messages=[{"role": "user", "content": "Explain MLA architecture."}]
)', 'MMLU-Redux: 89.1%, HumanEval: 90.2%, MATH-500: 75.7%', 'Massive parameter footprint requires multi-GPU or cloud API hosting.', 'https://www.deepseek.com', '[{"text":"DeepSeek-V3 Technical Report","url":"https://github.com/deepseek-ai/DeepSeek-V3"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-R1', 'DeepSeek', 'Model', 'NLP', 'MIT', 2025, '671B (37B active)', 'Breakthrough open-weights reasoning model trained via large-scale reinforcement learning (RL) without supervised fine-tuning, rivaling top proprietary reasoning models.', 'DeepSeek-V3 Base + Large-scale Multi-Stage RL with self-verification reasoning.', 'from openai import OpenAI
client = OpenAI(api_key="YOUR_KEY", base_url="https://api.deepseek.com")
response = client.chat.completions.create(
  model="deepseek-reasoner",
  messages=[{"role": "user", "content": "Solve: What is the sum of integers from 1 to 100?"}]
)', 'AIME 2024: 79.8%, MATH-500: 97.3%, Codeforces: 96.3 percentile', 'Outputs lengthy reasoning chains which increase token consumption and response latency.', 'https://www.deepseek.com', '[{"text":"DeepSeek-R1 Technical Report","url":"https://arxiv.org/abs/2501.12948"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-R1-Distill-Qwen-32B', 'DeepSeek', 'Model', 'NLP', 'MIT', 2025, '32B params', 'Dense 32B reasoning model distilled from DeepSeek-R1 onto Qwen2.5-32B, delivering top-tier mathematical and coding logic on consumer hardware.', 'Qwen2.5-32B backbone fine-tuned on 800k DeepSeek-R1 reasoning trajectories.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-32B", device_map="auto")', 'AIME 2024: 72.6%, MATH-500: 94.3%, LiveCodeBench: 57.2%', 'Higher resource consumption than 8B models; requires ~20GB VRAM with 4-bit quantization.', 'https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B', '[{"text":"DeepSeek-R1 Distillation","url":"https://github.com/deepseek-ai/DeepSeek-R1"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-Coder-V2', 'DeepSeek', 'Model', 'AI Coding', 'MIT', 2024, '236B (21B active)', 'Open-source mixture-of-experts code intelligence model supporting 338 programming languages and 128k context window.', 'MoE Transformer initialized from DeepSeek-V2 with code & math continual pre-training.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-Coder-V2-Instruct", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-Coder-V2-Instruct", trust_remote_code=True, device_map="auto")', 'HumanEval: 90.2%, MBPP+: 76.2%, SWE-bench: 12.7%', 'High RAM/VRAM footprint for 236B model; requires distributed inference.', 'https://github.com/deepseek-ai/DeepSeek-Coder-V2', '[{"text":"DeepSeek-Coder-V2 Paper","url":"https://arxiv.org/abs/2406.11931"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3.3 (70B)', 'Meta AI', 'Model', 'NLP', 'Llama 3.3 Community License', 2024, '70B params', 'Meta''s flagship open-weights instruction model delivering capabilities comparable to previous 405B models with 70B parameter efficiency.', 'Autoregressive Transformer with Grouped-Query Attention (GQA) and 128k context length.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.3-70B-Instruct", device_map="auto")', 'MMLU: 88.6%, HumanEval: 88.4%, GPQA: 50.5%', 'Commercial restriction for products exceeding 700M monthly active users.', 'https://ai.meta.com/llama/', '[{"text":"Llama 3.3 Release","url":"https://ai.meta.com/blog/llama-3-3/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3.2 (3B)', 'Meta AI', 'Model', 'NLP', 'Llama 3.2 Community License', 2024, '3.21B params', 'Compact, on-device multilingual small language model optimized for edge devices, mobile compute, and high-speed local inference.', 'Pruned and distilled Transformer with 128k context window support.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct", device_map="auto")', 'MMLU: 63.4%, GSM8K: 77.7%', 'Less capable on deep multi-step scientific and reasoning problems.', 'https://ai.meta.com/llama/', '[{"text":"Llama 3.2 Announcement","url":"https://ai.meta.com/blog/llama-3-2-connect-2024/"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3.2 Vision (11B)', 'Meta AI', 'Model', 'Multimodal', 'Llama 3.2 Community License', 2024, '11B params', 'Open-weights multimodal vision-language model capable of image understanding, visual reasoning, chart analysis, and document parsing.', 'Vision encoder adapter integrated into Llama 3.2 text decoder.', 'from transformers import MllamaForConditionalGeneration, AutoProcessor
model = MllamaForConditionalGeneration.from_pretrained("meta-llama/Llama-3.2-11B-Vision-Instruct", device_map="auto")', 'DocVQA: 88.4%, ChartQA: 83.4%, MathVista: 57.2%', 'Vision encoder increases VRAM requirements during high-resolution multi-image processing.', 'https://ai.meta.com/llama/', '[{"text":"Llama 3.2 Vision Model Card","url":"https://ai.meta.com/blog/llama-3-2-connect-2024/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Qwen 2.5 (72B)', 'Alibaba Cloud', 'Model', 'NLP', 'Apache-2.0', 2024, '72.7B params', 'Alibaba Cloud''s flagship open LLM featuring world-class multilingual capabilities across 29+ languages, 128k context support, and leading coding benchmarks.', 'Dense Transformer with RoPE, SwiGLU, RMSNorm, and GQA.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-72B-Instruct", device_map="auto")', 'MMLU: 86.8%, MATH: 83.1%, HumanEval: 86.6%', 'Full precision requires ~145GB VRAM; requires 4-bit quant to run on single 24GB/48GB GPU.', 'https://github.com/QwenLM/Qwen2.5', '[{"text":"Qwen2.5 Announcement","url":"https://qwenlm.github.io/blog/qwen2.5/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Qwen 2.5-Coder (32B)', 'Alibaba Cloud', 'Model', 'AI Coding', 'Apache-2.0', 2024, '32.5B params', 'State-of-the-art open-source code generation model, matching GPT-4o on coding benchmarks while supporting 128k context tokens and code artifact editing.', 'Transformer decoder specialized on 5.5 trillion code tokens.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-Coder-32B-Instruct", device_map="auto")', 'HumanEval: 92.7%, EvalPlus: 87.2%, MultiPL-E: 84.1%', 'Optimized specifically for code; creative prose is slightly secondary.', 'https://github.com/QwenLM/Qwen2.5-Coder', '[{"text":"Qwen2.5-Coder Technical Blog","url":"https://qwenlm.github.io/blog/qwen2.5-coder/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Qwen 2.5-VL (72B)', 'Alibaba Cloud', 'Model', 'Multimodal', 'Apache-2.0', 2025, '72B params', 'Vision-language foundation model capable of reading hour-long videos, parsing fine-grained document charts, and operating computer UIs via agent grounding.', 'Dynamic resolution Vision Transformer (ViT) paired with Qwen 2.5 language backbone.', 'from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
model = Qwen2_5_VLForConditionalGeneration.from_pretrained("Qwen/Qwen2.5-VL-72B-Instruct", device_map="auto")', 'DocVQA: 95.8%, Video-MME: 82.5%, MathVista: 71.9%', 'High token consumption on long video streams.', 'https://github.com/QwenLM/Qwen2.5-VL', '[{"text":"Qwen2.5-VL Release","url":"https://qwenlm.github.io/blog/qwen2.5-vl/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Qwen 2.5-Math (72B)', 'Alibaba Cloud', 'Model', 'Research', 'Apache-2.0', 2024, '72.7B params', 'Specialized mathematical reasoning model trained with chain-of-thought and tool-integrated reasoning (TIR) for solving complex olympiad-level math.', 'Dense Transformer tuned on bilingual math synthesis and code-assisted execution.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-Math-72B-Instruct", device_map="auto")', 'MATH: 88.2%, GSM8K: 95.9%, OlympiadBench: 56.4%', 'Specialized strictly for math and quantitative calculations.', 'https://github.com/QwenLM/Qwen2.5-Math', '[{"text":"Qwen2.5-Math Paper","url":"https://arxiv.org/abs/2409.12122"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude 3.7 Sonnet', 'Anthropic', 'Model', 'NLP', 'Proprietary', 2025, 'Unknown', 'Anthropic''s hybrid reasoning frontier model that dynamically switches between near-instant conversational responses and deep extended step-by-step thinking.', 'Transformer-based multimodal foundation model with controllable thinking budget tokens.', 'import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
  model="claude-3-7-sonnet-20250219",
  max_tokens=4096,
  thinking={"type": "enabled", "budget_tokens": 2048},
  messages=[{"role": "user", "content": "Analyze complex architecture vulnerabilities."}]
)', 'SWE-bench Verified: 70.3%, GPQA Diamond: 65.2%, TAU-bench: 81.2%', 'Extended reasoning uses token budget; proprietary API pricing.', 'https://www.anthropic.com/claude', '[{"text":"Claude 3.7 Sonnet Announcement","url":"https://www.anthropic.com/news/claude-3-7-sonnet"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude 3.5 Haiku', 'Anthropic', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Anthropic''s fastest language model, matching original Claude 3 Opus capabilities at blazing speed and lower operational cost.', 'Compact distilled Transformer with Constitutional AI alignment.', 'import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
  model="claude-3-5-haiku-20241022",
  max_tokens=1024,
  messages=[{"role": "user", "content": "Extract entities from this invoice."}]
)', 'MMLU: 80.9%, HumanEval: 75.9%, GPQA: 41.6%', 'Less suited for open-ended multi-page deep thesis analysis.', 'https://www.anthropic.com/claude', '[{"text":"Claude 3.5 Haiku Release","url":"https://www.anthropic.com/news/claude-3-5-haiku"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('o3-mini', 'OpenAI', 'Model', 'AI Coding', 'Proprietary', 2025, 'Unknown', 'OpenAI''s cost-efficient STEM, math, and coding reasoning model with selectable reasoning effort levels (low, medium, high) and function calling.', 'Reinforcement learning-trained reasoning model optimized for coding and STEM.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="o3-mini",
  reasoning_effort="medium",
  messages=[{"role": "user", "content": "Design an optimal LRU cache in Rust."}]
)', 'AIME 2024: 87.3%, Codeforces Rating: 2088, GPQA: 79.7%', 'Text only (no image modality input); reasoning adds latency.', 'https://openai.com', '[{"text":"OpenAI o3-mini Announcement","url":"https://openai.com/index/openai-o3-mini/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gemini 2.0 Flash', 'Google DeepMind', 'Model', 'Multimodal', 'Proprietary', 2024, 'Unknown', 'Google DeepMind''s agentic multimodal model delivering real-time streaming audio/video generation, sub-second latency, and native tool execution.', 'Natively multimodal Mixture-of-Experts architecture supporting 1M context.', 'from google import genai
client = genai.Client()
response = client.models.generate_content(
  model="gemini-2.0-flash",
  contents="Explain quantum computing simply."
)', 'MMLU-Pro: 78.5%, MathVista: 68.3%, TTFT 2x faster than 1.5 Flash', 'API quota boundaries and regional service availability.', 'https://deepmind.google/technologies/gemini/', '[{"text":"Gemini 2.0 Flash Release","url":"https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gemini 2.0 Flash Thinking', 'Google DeepMind', 'Model', 'Research', 'Proprietary', 2024, 'Unknown', 'Experimental reasoning edition of Gemini 2.0 Flash that outputs chain-of-thought steps for visual and logical problem-solving.', 'Multimodal MoE with explicit reasoning tokens and reflection loops.', 'from google import genai
client = genai.Client()
response = client.models.generate_content(
  model="gemini-2.0-flash-thinking-exp",
  contents="Solve this physics circuit diagram problem."
)', 'MATH-500: 92.4%, AIME 2024: 74.3%', 'Experimental model with dynamic rate limits.', 'https://deepmind.google/technologies/gemini/', '[{"text":"Gemini Thinking Model","url":"https://deepmind.google/technologies/gemini/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Phi-4 (14B)', 'Microsoft', 'Model', 'Research', 'MIT', 2024, '14.7B params', 'Microsoft''s 14B parameter state-of-the-art small reasoning model trained with highly synthetic, curated datasets for outsized math and science reasoning.', 'Dense Transformer trained with synthetic textbook data and multi-agent debate.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("microsoft/phi-4", device_map="auto")', 'MMLU: 84.8%, MATH-500: 80.4%, GPQA: 56.1%', 'Smaller parameter capacity limits broad factual knowledge retrieval.', 'https://huggingface.co/microsoft/phi-4', '[{"text":"Phi-4 Technical Report","url":"https://arxiv.org/abs/2412.08905"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Phi-3.5 MoE', 'Microsoft', 'Model', 'NLP', 'MIT', 2024, '41.9B (6.6B active)', 'Lightweight Mixture-of-Experts model from Microsoft activating 2 out of 16 experts (6.6B active params from 41.9B total), with 128k context support.', '16-expert MoE architecture with 128k context window.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3.5-MoE-instruct", trust_remote_code=True, device_map="auto")', 'MMLU: 78.9%, GSM8K: 85.1%', 'Requires distributed tensor routing for optimal MoE parallelization.', 'https://huggingface.co/microsoft/Phi-3.5-MoE-instruct', '[{"text":"Phi-3.5 Announcement","url":"https://azure.microsoft.com/en-us/blog/introducing-phi-3-5-small-language-models/"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mistral Large 2 (123B)', 'Mistral AI', 'Model', 'NLP', 'Mistral Research License / Commercial', 2024, '123B params', 'Mistral AI''s 123-billion parameter flagship model with 128k context window, advanced multilingual fluency in 80+ languages, and top code generation.', 'Dense Transformer with 128k context window and enhanced function calling.', 'from mistralai import Mistral
client = Mistral(api_key="API_KEY")
response = client.chat.complete(
  model="mistral-large-latest",
  messages=[{"role": "user", "content": "Analyze economic trends."}]
)', 'MMLU: 84.0%, HumanEval: 92.0%, GSM8K: 91.2%', 'Commercial weights require paid enterprise license.', 'https://mistral.ai/news/mistral-large-2407/', '[{"text":"Mistral Large 2 Announcement","url":"https://mistral.ai/news/mistral-large-2407/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Codestral 22B', 'Mistral AI', 'Model', 'AI Coding', 'Mistral Non-Production License', 2024, '22B params', 'Mistral AI''s code generation model tailored for fill-in-the-middle (FIM), code completion, unit test drafting, and repository navigation across 80+ languages.', 'Dense autoregressive model with 32k context and bidirectional FIM tokens.', 'from mistralai import Mistral
client = Mistral(api_key="API_KEY")
response = client.fim.complete(
  model="codestral-latest",
  prompt="def calculate_fibonacci(n):",
  suffix="return result"
)', 'HumanEval: 81.1%, MBPP: 78.2%, Spider: 67.5%', 'Non-commercial license for direct weights use unless licensed via Mistral API.', 'https://mistral.ai/news/codestral/', '[{"text":"Codestral Announcement","url":"https://mistral.ai/news/codestral/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('FLUX.1 Schnell', 'Black Forest Labs', 'Model', 'Image Generation', 'Apache-2.0', 2024, '12B params', 'Black Forest Labs'' ultra-fast 12B parameter open text-to-image rectified flow transformer, generating high-fidelity images in just 1 to 4 diffusion steps.', 'Hybrid multimodal rectified flow transformer with rotary position embeddings (RoPE).', 'import torch
from diffusers import FluxPipeline
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
image = pipe("A cozy cafe on Mars with neon lighting", num_inference_steps=4).images[0]', 'ELO rating: 1140+ (Superior prompt adherence and in-image typography)', '12B parameter weights require at least 12GB-16GB VRAM for GPU execution.', 'https://blackforestlabs.ai', '[{"text":"FLUX.1 Release","url":"https://blackforestlabs.ai/announcing-black-forest-labs/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('HunyuanVideo', 'Tencent', 'Model', 'Video Generation', 'Apache-2.0', 2024, '13B params', 'Tencent''s open-weights 13B dual-stream text-to-video foundation model delivering cinema-quality 720p 24fps video clips with exceptional physics consistency.', 'Dual-stream Diffusion Transformer (DiT) integrating 3D VAE with text-video cross-attention.', 'from diffusers import HunyuanVideoPipeline
pipe = HunyuanVideoPipeline.from_pretrained("Tencent-Hunyuan/HunyuanVideo", torch_dtype=torch.bfloat16)
video = pipe("Astronaut riding a horse on the moon, cinematic 4k").frames[0]', 'VBench Total: 85.2% (Top ranked open-source text-to-video model)', 'High VRAM requirements (recommended 44GB+ for unquantized inference).', 'https://github.com/Tencent/HunyuanVideo', '[{"text":"HunyuanVideo Technical Report","url":"https://arxiv.org/abs/2412.03603"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('CogVideoX-5B', 'THUDM / Zhipu AI', 'Model', 'Video Generation', 'Apache-2.0', 2024, '5B params', 'Open-source text-to-video foundation model from THUDM featuring 3D causal VAE and Expert Transformer blocks for 6-second video generation.', '3D Causal Convolutional VAE + Diffusion Transformer (DiT).', 'from diffusers import CogVideoXPipeline
pipe = CogVideoXPipeline.from_pretrained("THUDM/CogVideoX-5b", torch_dtype=torch.bfloat16)
video = pipe(prompt="A golden retriever swimming in a crystal clear lake").frames[0]', 'VBench dynamic degree: 82.7%, Motion smoothness: 84.1%', 'High memory utilization during spatial-temporal latent decompression.', 'https://github.com/THUDM/CogVideo', '[{"text":"CogVideoX Paper","url":"https://arxiv.org/abs/2408.06072"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mochi 1', 'Genmo', 'Model', 'Video Generation', 'Apache-2.0', 2024, '10B params', 'Genmo''s open-weights 10B diffusion model for fluid, high-fidelity 480p video generation at 30fps with state-of-the-art prompt motion fidelity.', 'Asymmetric Diffusion Transformer (AsymmDiT) with continuous-time flow matching.', 'from diffusers import MochiPipeline
pipe = MochiPipeline.from_pretrained("genmo/mochi-1-preview", torch_dtype=torch.bfloat16)', 'High human preference score for prompt adherence in open text-to-video.', 'Requires 4x H100 or aggressive quantization for multi-second rendering.', 'https://github.com/genmoai/models', '[{"text":"Mochi 1 Preview","url":"https://www.genmo.ai/blog/mochi-1"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LTX-Video', 'Lightricks', 'Model', 'Video Generation', 'Apache-2.0', 2024, '2B params', 'Lightricks'' open real-time video foundation model capable of generating high-definition 24fps video in under 5 seconds on commercial GPUs.', 'Spatial-temporal DiT with distilled multi-step rectified flow.', 'from diffusers import LTXPipeline
pipe = LTXPipeline.from_pretrained("Lightricks/LTX-Video", torch_dtype=torch.bfloat16)', 'Generates 5-second video in ~4 seconds on a single NVIDIA A100.', 'Lower maximum resolution (768x512) before upscaling.', 'https://github.com/Lightricks/LTX-Video', '[{"text":"LTX-Video Announcement","url":"https://www.lightricks.com/ltx-video"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Whisper v3 Turbo', 'OpenAI', 'Model', 'Audio', 'MIT', 2024, '809M params', 'OpenAI''s optimized speech recognition model providing near whisper-large-v3 accuracy at 8x faster inference speed.', 'Pruned 4-layer decoder encoder-decoder Transformer.', 'import whisper
model = whisper.load_model("turbo")
result = model.transcribe("audio.mp3")
print(result["text"])', 'Word Error Rate (WER): 7.1% on multilingual Common Voice; 8x inference speedup.', 'Slight accuracy trade-off in heavily accented or noisy audio compared to full large-v3.', 'https://github.com/openai/whisper', '[{"text":"Whisper Turbo Release","url":"https://github.com/openai/whisper/discussions/2363"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Kokoro-82M', 'Hexgrad', 'Model', 'Audio', 'Apache-2.0', 2025, '82M params', 'Hexgrad''s open-weights 82M parameter text-to-speech model producing studio-quality English and multilingual voice audio in real time on CPUs.', 'StyleTTS 2 architecture with ISTFT vocoder.', 'from kokoro import KPipeline
pipeline = KPipeline(lang_code=''a'')
generator = pipeline("Hello, welcome to AiVerse!", voice=''af_heart'', speed=1.0)', 'Real-time factor < 0.1 on modern consumer CPUs; highly ranked on TTS Arena.', 'Trained primarily on English and select Romance languages.', 'https://huggingface.co/hexgrad/Kokoro-82M', '[{"text":"Kokoro Model Card","url":"https://huggingface.co/hexgrad/Kokoro-82M"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LangGraph', 'LangChain', 'Framework', 'MLOps', 'MIT', 2024, 'N/A', 'Stateful orchestration library from LangChain for building cyclic, multi-agent workflows, human-in-the-loop oversight, and durable execution state.', 'Graph-based execution engine with state persistence checkpoints.', 'from langgraph.graph import StateGraph, START, END
builder = StateGraph(dict)
builder.add_node("agent", lambda state: {"msg": "Done"})
builder.add_edge(START, "agent")
builder.add_edge("agent", END)
graph = builder.compile()', 'De facto industry standard for multi-agent loops and agentic workflow orchestration.', 'Requires structured state typing; higher complexity than linear chains.', 'https://github.com/langchain-ai/langgraph', '[{"text":"LangGraph Docs","url":"https://langchain-ai.github.io/langgraph/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('CrewAI', 'CrewAI Inc.', 'Framework', 'Productivity', 'MIT', 2024, 'N/A', 'Production-ready framework for orchestrating role-playing autonomous AI agents that collaborate seamlessly to solve complex tasks.', 'Role-based agent abstraction with task delegation and hierarchical memory.', 'from crewai import Agent, Task, Crew
researcher = Agent(role=''Researcher'', goal=''Investigate tech trends'', memory=True)
task = Task(description=''Summarize 2025 AI models'', expected_output=''Bullet summary'', agent=researcher)
crew = Crew(agents=[researcher], tasks=[task])
crew.kickoff()', 'Over 25,000 GitHub stars; widely used in enterprise workflow automation.', 'Iterative agent loops can quickly trigger API rate limits without rate limiting.', 'https://github.com/crewAIInc/crewAI', '[{"text":"CrewAI Documentation","url":"https://docs.crewai.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('AutoGen v0.4', 'Microsoft', 'Framework', 'MLOps', 'MIT', 2024, 'N/A', 'Microsoft''s redesigned asynchronous event-driven multi-agent framework supporting distributed actor patterns, human intervention, and scalable conversations.', 'Asynchronous actor-based event messaging architecture for agents.', 'from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient
agent = AssistantAgent("assistant", OpenAIChatCompletionClient(model="gpt-4o"))', 'Benchmark leader for multi-agent benchmark problem solving (GAIA & SWE-bench).', 'Major API breaking rewrite in v0.4 from legacy v0.2.', 'https://github.com/microsoft/autogen', '[{"text":"AutoGen v0.4 Architecture","url":"https://microsoft.github.io/autogen/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('SGLang', 'LMSYS', 'Framework', 'MLOps', 'Apache-2.0', 2024, 'N/A', 'Fast LLM serving and programming engine featuring RadixAttention (KV cache sharing across multi-turn chats) for ultra-low latency inference and structured output.', 'RadixAttention tree cache + interpreter-runtime co-design engine.', 'import sglang as sgl
@sgl.function
def qa(s, question):
    s += sgl.user(question)
    s += sgl.assistant(sgl.gen("answer", max_tokens=100))', 'Up to 5x higher throughput on complex multi-turn chats compared to baseline vLLM.', 'Focuses on Linux x86 and NVIDIA CUDA environments.', 'https://github.com/sgl-project/sglang', '[{"text":"SGLang Paper","url":"https://arxiv.org/abs/2312.07104"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Unsloth', 'Unsloth AI', 'Framework', 'MLOps', 'Apache-2.0', 2024, 'N/A', 'Ultra-fast open-source fine-tuning framework providing 2x-5x faster training speeds and up to 80% lower VRAM memory usage for Llama, Mistral, Qwen, and DeepSeek.', 'Custom OpenAI Triton manual backpropagation GPU kernels.', 'from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
    max_seq_length=2048,
    load_in_4bit=True
)', '5x faster training, 0% accuracy loss compared to standard Hugging Face Trainer.', 'Exclusively tailored for NVIDIA GPUs (Compute Capability 7.0+).', 'https://github.com/unslothai/unsloth', '[{"text":"Unsloth Documentation","url":"https://docs.unsloth.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Axolotl', 'Open Source', 'Framework', 'MLOps', 'Apache-2.0', 2024, 'N/A', 'Streamlined tool for fine-tuning LLMs with SFT, DPO, KTO, and LoRA across various architectures using simple declarative YAML config files.', 'Modular PyTorch/Deepspeed/FSDP harness for scalable training.', 'accelerate launch -m axolotl.cli.train config.yaml', 'Used to train OpenHermes, Zephyr, and top open-weights community models.', 'Complex multi-node configurations require solid Linux cluster admin experience.', 'https://github.com/axolotl-ai-cloud/axolotl', '[{"text":"Axolotl Repository","url":"https://github.com/axolotl-ai-cloud/axolotl"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DSPy', 'Stanford NLP', 'Framework', 'Research', 'MIT', 2024, 'N/A', 'Stanford NLP''s framework for algorithmically optimizing language model prompts, weights, and retrieval parameters via declarative modules and automatic teleprompters.', 'Declarative LM programming framework with compiler/optimizer loop.', 'import dspy
dspy.settings.configure(lm=dspy.OpenAI(model=''gpt-4o''))
class MultiHopQA(dspy.Module):
    def __init__(self):
        self.generate_query = dspy.ChainOfThought("claim -> query")
        self.retrieve = dspy.Retrieve(k=3)', 'Improves pipeline accuracy by 25%-40% compared to static prompt chains.', 'Requires learning module abstractions rather than writing raw prompt strings.', 'https://github.com/stanfordnlp/dspy', '[{"text":"DSPy Paper","url":"https://arxiv.org/abs/2310.03714"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Smolagents', 'Hugging Face', 'Framework', 'AI Coding', 'Apache-2.0', 2025, '~1,000 LOC', 'Hugging Face''s lightweight Python-first agent library where agents write executable Python code directly instead of parsing JSON action strings.', 'CodeAgent execution loop running in a secure Python sandbox.', 'from smolagents import CodeAgent, HfApiModel, DuckDuckGoSearchTool
agent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=HfApiModel())
agent.run("What is the latest score of the Mars Rover mission?")', '30% fewer token overhead and higher tool success rate on GAIA benchmarks.', 'Code execution requires sandbox container isolation for untrusted user inputs.', 'https://github.com/huggingface/smolagents', '[{"text":"Smolagents Launch","url":"https://huggingface.co/blog/smolagents"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Instructor', 'Jason Liu', 'Framework', 'MLOps', 'MIT', 2024, 'N/A', 'Python and TypeScript library built on Pydantic to extract guaranteed, strictly validated structured data from any LLM provider.', 'Pydantic schema injection and automatic validation retry handler.', 'import instructor
from openai import OpenAI
from pydantic import BaseModel

client = instructor.from_openai(OpenAI())
class User(BaseModel):
    name: str
    age: int

user = client.chat.completions.create(
    model="gpt-4o",
    response_model=User,
    messages=[{"role": "user", "content": "Alice is 28 years old."}]
)', 'Eliminates structured JSON extraction parse failures across 10+ LLM backends.', 'Relies on underlying LLM function calling or tool use capabilities.', 'https://github.com/jxnl/instructor', '[{"text":"Instructor Docs","url":"https://python.useinstructor.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Outlines', 'dottxt', 'Framework', 'MLOps', 'Apache-2.0', 2024, 'N/A', 'Guided generation framework from .txt that forces LLMs to generate text conforming strictly to regular expressions, JSON schemas, or context-free grammars with mathematical guarantee.', 'Finite-state machine (FSM) token mask generator for autoregressive sampling.', 'import outlines
model = outlines.models.transformers("meta-llama/Llama-3.2-3B")
generator = outlines.generate.json(model, UserSchema)
result = generator("Extract user details from text")', 'Zero JSON syntax errors with negligible sampling runtime overhead.', 'Requires tokenizer vocabulary and logit indexing access.', 'https://github.com/dottxt-ai/outlines', '[{"text":"Outlines Paper","url":"https://arxiv.org/abs/2307.09702"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LiteLLM', 'BerriAI', 'Framework', 'MLOps', 'MIT', 2024, 'N/A', 'Universal proxy and Python SDK to call 100+ LLM APIs (OpenAI, Anthropic, Bedrock, Vertex, Ollama, Groq) using the standard OpenAI format with load balancing and fallbacks.', 'Unified API gateway proxy and translation layer.', 'from litellm import completion
response = completion(
    model="anthropic/claude-3-5-sonnet-20240620",
    messages=[{"role": "user", "content": "Hello World"}]
)', '99.99% gateway reliability with automatic multi-provider failover routing.', 'Gateway proxy adds slight network hop (~5ms) in high-throughput setups.', 'https://github.com/BerriAI/litellm', '[{"text":"LiteLLM Documentation","url":"https://docs.litellm.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Transformers.js', 'Hugging Face', 'Framework', 'MLOps', 'Apache-2.0', 2024, 'N/A', 'State-of-the-art ML library from Hugging Face that runs pretrained models directly inside web browsers and Node.js with zero server dependencies via ONNX Runtime and WebGPU.', 'WebAssembly + WebGPU execution runtime for ONNX neural network models.', 'import { pipeline } from ''@huggingface/transformers'';
const classifier = await pipeline(''sentiment-analysis'');
const output = await classifier(''I love running AI locally in my browser!'');', 'Up to 10x speedup utilizing client-side WebGPU acceleration in Chrome/Edge.', 'Model size bounded by client browser RAM / VRAM allocation.', 'https://github.com/huggingface/transformers.js', '[{"text":"Transformers.js Docs","url":"https://huggingface.co/docs/transformers.js"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Distilabel', 'Argilla', 'Framework', 'Research', 'Apache-2.0', 2024, 'N/A', 'Argilla''s framework for synthetic data generation and AI feedback (RLAIF) capable of scaling pipelines for multi-turn DPO, preference datasets, and instruction fine-tuning.', 'Step-based data synthesis and evaluation pipeline orchestrator.', 'from distilabel.pipeline import Pipeline
with Pipeline("SyntheticData") as pipeline:
    # Define generation steps and LLM judges', 'Powered the creation of UltraFeedback, OpenHermes, and benchmark preference datasets.', 'Generates high API usage costs when scaling large synthetic batches.', 'https://github.com/argilla-io/distilabel', '[{"text":"Distilabel Docs","url":"https://distilabel.argilla.io"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('OpenRouter', 'OpenRouter', 'Platform', 'MLOps', 'Proprietary', 2024, '200+ models', 'Unified API gateway and marketplace routing to 200+ AI models across dozens of providers with automatic failover, cost optimization, and open community stats.', 'Low-latency global edge API router with multi-provider fallback.', 'fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "deepseek/deepseek-r1",
    "messages": [{"role": "user", "content": "Hello!"}]
  })
})', 'Industry leader in model choice and real-time LLM token throughput telemetry.', 'Upstream provider outages can impact specific model routes.', 'https://openrouter.ai', '[{"text":"OpenRouter","url":"https://openrouter.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GroqCloud', 'Groq', 'Platform', 'MLOps', 'Proprietary', 2024, 'LPU clusters', 'Ultra-fast AI inference platform powered by Groq''s custom LPU (Language Processing Unit) silicon, generating 500+ tokens per second for open LLMs.', 'Deterministic tensor streaming architecture on custom silicon.', 'from groq import Groq
client = Groq(api_key="GROQ_API_KEY")
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Summarize this live."}]
)', '550+ tokens/sec on Llama 3.3 70B, over 10x faster than standard GPU clouds.', 'Limited context window lengths compared to huge GPU memory clusters.', 'https://groq.com', '[{"text":"Groq LPU Architecture","url":"https://groq.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Modal', 'Modal Labs', 'Platform', 'MLOps', 'Proprietary', 2024, 'Elastic GPU cloud', 'Serverless cloud compute platform designed for running GPU-accelerated Python containers, AI microservices, fine-tuning, and inference in seconds.', 'Containerized serverless runtime with cold starts under 2 seconds.', 'import modal
app = modal.App("fast-inference")
@app.function(gpu="A100")
def generate():
    return "Generated from serverless GPU"', 'Industry-leading cold start latency for containerized PyTorch and vLLM workloads.', 'Requires Python-centric infrastructure design.', 'https://modal.com', '[{"text":"Modal Documentation","url":"https://modal.com/docs"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Fireworks AI', 'Fireworks AI', 'Platform', 'MLOps', 'Proprietary', 2024, 'Cloud API', 'Production-grade generative AI inference platform delivering blazing fast latency and cost efficiency for open-weights vision, audio, and language models.', 'Custom inference engine with fine-grained speculative decoding and LoRA multiplexing.', 'from openai import OpenAI
client = OpenAI(base_url="https://api.fireworks.ai/inference/v1", api_key="FW_KEY")
response = client.chat.completions.create(model="accounts/fireworks/models/deepseek-v3", messages=[...])', 'Sub-100ms time-to-first-token and ultra-high concurrency.', 'Proprietary cloud platform.', 'https://fireworks.ai', '[{"text":"Fireworks AI Platform","url":"https://fireworks.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Cerebras Cloud', 'Cerebras Systems', 'Platform', 'MLOps', 'Proprietary', 2024, 'Wafer-scale engine', 'Wafer-Scale AI compute platform powered by CS-3 systems, delivering up to 2,000 tokens per second for Llama 3 models.', 'WSE-3 single-die wafer processor with 900,000 AI cores and 44GB on-chip SRAM.', 'from cerebras.cloud.sdk import Cerebras
client = Cerebras(api_key="CEREBRAS_API_KEY")
response = client.chat.completions.create(model="llama3.1-70b", messages=[{"role": "user", "content": "Fast code review."}])', '2,100 tokens/sec on Llama 3.1 8B, 450 tokens/sec on 70B.', 'Proprietary wafer hardware; limited custom model import options.', 'https://cerebras.ai', '[{"text":"Cerebras Inference","url":"https://cerebras.ai/inference"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('llama.cpp', 'Georgi Gerganov', 'Platform', 'MLOps', 'MIT', 2023, 'N/A', 'Pure C/C++ inference implementation for LLMs with GGUF quantization, enabling fast CPU and GPU execution across Mac Metal, Windows, and Linux.', 'C++ core with GGML tensor library and low-precision integer quantization.', './llama-cli -m models/llama-3.3-70b-instruct.Q4_K_M.gguf -p "Explain gravity" -n 128', 'Underpins Ollama, LM Studio, and local AI on Apple Silicon.', 'Manual command line configuration needed for advanced distributed setups.', 'https://github.com/ggerganov/llama.cpp', '[{"text":"llama.cpp GitHub","url":"https://github.com/ggerganov/llama.cpp"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('RunPod', 'RunPod Inc.', 'Platform', 'MLOps', 'Proprietary', 2023, 'Global GPU pods', 'Globally distributed cloud GPU platform offering on-demand instances and serverless GPU endpoints for AI training and inference at low cost.', 'Kubernetes-orchestrated bare-metal and serverless GPU container fabric.', 'import runpod
runpod.api_key = "KEY"
endpoint = runpod.Endpoint("ENDPOINT_ID")
run_request = endpoint.run({"input": {"prompt": "AI art"}})
print(run_request.output())', 'Top cost-to-performance provider for indie AI builders and startups.', 'Spot instance availability can fluctuate based on global demand.', 'https://www.runpod.io', '[{"text":"RunPod Docs","url":"https://docs.runpod.io"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepInfra', 'DeepInfra', 'Platform', 'MLOps', 'Proprietary', 2023, 'Cloud API', 'Serverless pay-per-token API platform for hosting open-source LLMs, embeddings, speech-to-text, and image generation models at scale.', 'Elastic GPU cluster with automatic scale-to-zero serverless endpoints.', 'import openai
client = openai.OpenAI(api_key="DEEPINFRA_KEY", base_url="https://api.deepinfra.com/v1/openai")
res = client.chat.completions.create(model="meta-llama/Llama-3.3-70B-Instruct", messages=[...])', 'Low cost per million tokens with sub-200ms latency.', 'Proprietary cloud orchestration.', 'https://deepinfra.com', '[{"text":"DeepInfra","url":"https://deepinfra.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LangSmith', 'LangChain', 'Platform', 'MLOps', 'Proprietary', 2023, 'Cloud / Self-hosted', 'Enterprise LLMOps platform from LangChain for debugging, testing, evaluating, and monitoring LLM applications and complex agent workflows.', 'Distributed telemetry tracing backend with prompt management and online evaluation.', 'export LANGCHAIN_TRACING_V2="true"
export LANGCHAIN_API_KEY="your-api-key"
# All LangChain & LangGraph calls automatically trace to dashboard', 'Standard tracing tool for production agent developers.', 'Full tracing storage can be expensive at massive enterprise scale.', 'https://smith.langchain.com', '[{"text":"LangSmith Documentation","url":"https://docs.smith.langchain.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Weights & Biases Weave', 'Weights & Biases', 'Platform', 'MLOps', 'Apache-2.0 / SaaS', 2024, 'N/A', 'Lightweight LLM observability and evaluation toolkit from W&B that logs, versions, and systematically evaluates generative AI pipelines.', 'Decorated Python tracing library with automated schema extraction and web UI.', 'import weave
weave.init(''my-ai-app'')
@weave.op()
def generate_response(prompt: str) -> str:
    # Automatically tracked in dashboard
    return "Response"', 'Integrated into W&B ML tracking ecosystem used by top frontier AI labs.', 'Requires W&B account login for web UI dashboard.', 'https://wandb.ai/site/weave', '[{"text":"Weave Docs","url":"https://weave-docs.wandb.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Helicone', 'Helicone', 'Platform', 'MLOps', 'Apache-2.0 / Cloud', 2023, 'N/A', 'Open-source LLM observability, smart proxy caching, rate limiting, and cost tracking platform designed for production AI teams.', 'Edge reverse proxy with low-latency async logging and response caching.', 'from openai import OpenAI
client = OpenAI(base_url="https://oai.helicone.ai/v1", default_headers={"Helicone-Auth": "Bearer HELICONE_API_KEY"})', 'Caches repeated semantic queries reducing API bills by up to 40%.', 'Requires routing OpenAI SDK traffic through Helicone proxy URL.', 'https://www.helicone.ai', '[{"text":"Helicone Documentation","url":"https://docs.helicone.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Portkey AI Gateway', 'Portkey AI', 'Platform', 'MLOps', 'Apache-2.0 / Cloud', 2023, 'N/A', 'Production AI gateway offering load balancing, fallback routing, prompt management, and guardrails across 250+ LLMs with sub-1ms overhead.', 'Ultra-fast C++ based reverse proxy and control plane.', 'from portkey_ai import Portkey
portkey = Portkey(api_key="PORTKEY_API_KEY")
response = portkey.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": "Hello!"}])', '<1ms proxy latency overhead; 99.999% production routing reliability.', 'Requires integrating Portkey headers or SDK wrappers.', 'https://portkey.ai', '[{"text":"Portkey Docs","url":"https://docs.portkey.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('FineWeb & FineWeb-Edu', 'Hugging Face', 'Dataset', 'NLP', 'ODC-By 1.0', 2024, '15 Trillion tokens (44 TB)', '15-trillion token open web pretraining dataset from Hugging Face, including FineWeb-Edu filtered with automated AI educational quality scoring.', 'Curated dataset derived from 96 Common Crawl dumps with MinHash deduplication.', 'from datasets import load_dataset
ds = load_dataset("HuggingFaceFW/fineweb-edu", name="sample-100BT", split="train", streaming=True)', 'Pretraining on FineWeb-Edu yields higher MMLU per token than Meta Llama 3 web filtering.', 'Massive multi-terabyte download requirement for full uncompressed sets.', 'https://huggingface.co/datasets/HuggingFaceFW/fineweb', '[{"text":"FineWeb Announcement","url":"https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-details"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Cosmopedia', 'Hugging Face', 'Dataset', 'NLP', 'Apache-2.0', 2024, '25 Billion tokens', 'Largest synthetic dataset to date, containing over 30 million files and 25 billion tokens of synthetic textbooks, blog posts, and courseware generated by Mixtral.', 'Synthetic curriculum generated with prompt engineering over Web of Science and Wikipedia topics.', 'from datasets import load_dataset
ds = load_dataset("HuggingFaceTB/cosmopedia", split="train", streaming=True)', 'Used to train SmolLM and high-density knowledge small models.', 'Synthetic data contains stylistic generation quirks if unfiltered.', 'https://huggingface.co/datasets/HuggingFaceTB/cosmopedia', '[{"text":"Cosmopedia Blog","url":"https://huggingface.co/blog/cosmopedia"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('UltraFeedback', 'Argilla', 'Dataset', 'NLP', 'MIT', 2024, '64k prompts (250k pairs)', 'Large-scale preference dataset containing 64,000 multi-turn prompts with responses evaluated by GPT-4 across instruction following, truthfulness, and quality.', 'Binarized and scalar preference alignment dataset for DPO and KTO.', 'from datasets import load_dataset
ds = load_dataset("HuggingFaceH4/ultrafeedback_binarized", split="train_prefs")', 'Gold standard preference dataset for training Zephyr, Starling, and top DPO models.', 'Relies on GPT-4 evaluation scores as ground truth.', 'https://huggingface.co/datasets/argilla/ultrafeedback', '[{"text":"UltraFeedback Paper","url":"https://arxiv.org/abs/2310.01377"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('OpenHermes 2.5', 'Teknium', 'Dataset', 'NLP', 'MIT', 2023, '1,001,551 examples', 'Curated dataset of 1 million diverse conversation turns, code snippets, reasoning chains, and roleplay examples used to fine-tune state-of-the-art open models.', 'Curated collection of synthetic and human-annotated instruction datasets (ShareGPT, Airoboros, GPTeacher).', 'from datasets import load_dataset
ds = load_dataset("teknium/OpenHermes-2.5", split="train")', 'Trained OpenHermes-2.5-Mistral-7B to outperform standard 70B models in 2023.', 'Varied data sources include diverse subjective annotation quality.', 'https://huggingface.co/datasets/teknium/OpenHermes-2.5', '[{"text":"OpenHermes 2.5 Dataset","url":"https://huggingface.co/datasets/teknium/OpenHermes-2.5"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('MATH-500', 'OpenAI / Benchmark', 'Dataset', 'Research', 'MIT', 2024, '500 competition problems', 'Standardized 500-problem evaluation benchmark subset of the original MATH competition dataset used to measure multi-step mathematical reasoning in frontier models.', 'Challenging math competition problems spanning algebra, geometry, number theory, and calculus.', 'from datasets import load_dataset
ds = load_dataset("HuggingFaceH4/MATH-500", split="test")', 'Primary benchmark for OpenAI o1, o3-mini, and DeepSeek-R1 reasoning comparisons.', 'Static problem set creates potential risk of training data contamination over time.', 'https://huggingface.co/datasets/HuggingFaceH4/MATH-500', '[{"text":"MATH Benchmark Paper","url":"https://arxiv.org/abs/2103.03874"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('SWE-bench Verified', 'Princeton / OpenAI', 'Dataset', 'AI Coding', 'MIT', 2024, '500 verified GitHub issues', 'Human-verified subset of 500 real-world GitHub issues and unit test pull requests used to evaluate autonomous software engineering AI agents.', 'Dockerized reproducible environment harness across 12 major Python repositories.', 'from datasets import load_dataset
ds = load_dataset("princeton-nlp/SWE-bench_Verified", split="test")', 'The global gold standard benchmark for Devin, Claude 3.7 Sonnet, and autonomous coding agents.', 'Requires Dockerized test harness execution for each evaluated issue.', 'https://www.swebench.com', '[{"text":"SWE-bench Verified","url":"https://openai.com/index/introducing-swe-bench-verified/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LiveCodeBench', 'LiveCodeBench Team', 'Dataset', 'AI Coding', 'MIT', 2024, '1,000+ problems', 'Holistic, continuously updated, contamination-free code benchmark collected from LeetCode, AtCoder, and Codeforces to test modern LLM coding capabilities.', 'Time-stamped competitive coding problems with automated evaluation harnesses.', 'from datasets import load_dataset
ds = load_dataset("livecodebench/code_generation_lite", split="test")', 'Prevents benchmark memorization through temporal problem filtering.', 'Focuses on competitive algorithm logic rather than large-scale repo architecture.', 'https://livecodebench.github.io', '[{"text":"LiveCodeBench Paper","url":"https://arxiv.org/abs/2403.07974"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GAIA Benchmark', 'Meta / Hugging Face / AutoGPT', 'Dataset', 'Research', 'CC BY-SA 4.0', 2023, '466 questions', 'General AI Assistant benchmark testing AI agents on multi-modal, tool-use, web browsing, and multi-step complex real-world questions that humans solve easily.', '3-tier difficulty question set with multimodal attachments (PDFs, spreadsheets, images).', 'from datasets import load_dataset
ds = load_dataset("gaia-benchmark/GAIA", "2023_all", split="validation")', 'Humans score 92%, whereas leading AI models historically score 30%-60%.', 'Requires full web browsing and python tool execution environment to run evals.', 'https://huggingface.co/spaces/gaia-benchmark/leaderboard', '[{"text":"GAIA Benchmark Paper","url":"https://arxiv.org/abs/2311.12983"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LMSYS Chatbot Arena Conversations', 'LMSYS', 'Dataset', 'NLP', 'LMSYS Terms / Research', 2024, '1,000,000+ battles', 'Open dataset of over 1 million real-world pairwise prompt conversations and human preference votes collected from the LMSYS Chatbot Arena.', 'Crowdsourced human side-by-side preference votes with model identities revealed post-vote.', 'from datasets import load_dataset
ds = load_dataset("lmsys/chatbot_arena_conversations", split="train")', 'Industry standard for calculating ELO ratings of frontier LLMs.', 'Subject to prompt distribution biases of Arena visitors.', 'https://chat.lmsys.org', '[{"text":"LMSYS Chatbot Arena Paper","url":"https://arxiv.org/abs/2403.04132"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Dolma Dataset', 'AI2 (Allen Institute for AI)', 'Dataset', 'NLP', 'ODC-By 1.0', 2024, '3 Trillion tokens', '3-trillion token open pretraining dataset curated by the Allen Institute for AI (AI2) to power the open-source OLMo language models.', 'De-duplicated, safety-filtered web corpus from Common Crawl, Reddit, peS2o, and GitHub.', 'from datasets import load_dataset
ds = load_dataset("allenai/dolma", split="train", streaming=True)', 'Fully open pretraining recipe allowing 100% scientific reproducibility for LLM training.', 'Full dataset download requires high bandwidth and petabyte-scale storage.', 'https://github.com/allenai/dolma', '[{"text":"Dolma Technical Paper","url":"https://arxiv.org/abs/2402.00159"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('WildChat', 'Allen Institute for AI', 'Dataset', 'NLP', 'ODC-By 1.0', 2024, '1,000,000 conversations', 'Corpus of 1 million real-world user interactions with ChatGPT across 100+ languages, including moderation annotations and toxicity analysis.', 'Real-world conversational turns with multi-turn context and safety classifications.', 'from datasets import load_dataset
ds = load_dataset("allenai/WildChat-1M", split="train")', 'Critical dataset for studying user prompt drift, jailbreak attempts, and multilingual intent.', 'Includes raw unfiltered user queries requiring safety filtering during fine-tuning.', 'https://huggingface.co/datasets/allenai/WildChat-1M', '[{"text":"WildChat Paper","url":"https://arxiv.org/abs/2405.01070"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Arena-Hard-Auto', 'LMSYS', 'Dataset', 'Research', 'Apache-2.0', 2024, '500 complex prompts', 'Benchmark of 500 challenging, hard-to-distinguish real-world queries evaluated automatically using LLM-as-a-judge with high correlation to human Chatbot Arena rank.', 'Hard prompt filtering pipeline with GPT-4-Judge pairwise win rate calculations.', 'python -m arena_hard.eval --model-answers answers.jsonl', '98% rank correlation with human Chatbot Arena ELO at a fraction of human testing cost.', 'Susceptible to LLM judge biases such as length and formatting preference.', 'https://github.com/sunshanghai/arena-hard-auto', '[{"text":"Arena-Hard-Auto Release","url":"https://lmsys.org/blog/2024-04-19-arena-hard/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('v0 by Vercel', 'Vercel', 'AI', 'AI Coding', 'Proprietary', 2024, 'N/A', 'Generative UI design platform that creates production-grade, accessible React components and full frontend pages styled with Tailwind CSS and Shadcn UI from natural prompts.', 'Web Application / Fine-tuned LLM with React Component AST Compiler.', 'Visit v0.dev, enter prompt: "Modern crypto portfolio dashboard with dark mode charts", and click Copy Code to paste into your Next.js project.', 'Rapid frontend prototyping benchmark standard used by millions of web developers.', 'Specialized for frontend JSX/React interfaces; backend API logic requires manual setup.', 'https://v0.dev', '[{"text":"v0 by Vercel","url":"https://v0.dev"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Lovable.dev', 'Lovable', 'AI', 'AI Coding', 'Proprietary', 2024, 'N/A', 'Full-stack autonomous AI web application builder that generates complete web apps, database schemas via Supabase, user auth, and deploys live in minutes.', 'Full-stack AI code synthesizer with live Supabase database & GitHub synchronization.', 'Go to lovable.dev, type your app idea (e.g. "Airbnb for pet boarding"), customize components interactively, and deploy live.', 'Generates functional full-stack web applications with database persistence in under 3 minutes.', 'Complex enterprise microservice architectures require manual code export and expansion.', 'https://lovable.dev', '[{"text":"Lovable.dev","url":"https://lovable.dev"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('NotebookLM', 'Google', 'AI', 'Productivity', 'Proprietary', 2024, 'N/A', 'Google''s personalized AI research assistant powered by Gemini 1.5 Pro, featuring Audio Overviews that turn uploaded documents into dynamic conversational podcast discussions.', 'Grounded RAG pipeline powered by Gemini 1.5 Pro long context and conversational TTS.', 'Upload research papers, meeting notes, or PDFs at notebooklm.google.com, then click ''Audio Overview'' to generate an engaging AI podcast explanation.', 'Zero hallucination rate on user source documents through strict ground-truth attribution.', 'Outputs strictly restricted to user uploaded source materials.', 'https://notebooklm.google.com', '[{"text":"NotebookLM","url":"https://notebooklm.google.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Devin', 'Cognition AI', 'AI', 'AI Coding', 'Proprietary', 2024, 'N/A', 'The first autonomous AI software engineer, equipped with its own sandboxed shell, code editor, and browser to solve end-to-end engineering tasks independently.', 'Autonomous multi-step agent architecture with sandboxed compute environment.', 'Assign a GitHub issue or feature ticket to Devin via the Cognition dashboard or Slack integration.', '13.86% resolved on SWE-bench at launch; over 45% on modern benchmarks.', 'Requires human verification for large architectural migrations and security critical code.', 'https://cognition.ai', '[{"text":"Devin Announcement","url":"https://cognition.ai/blog/introducing-devin"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('OpenHands', 'All Hands AI', 'AI', 'AI Coding', 'MIT', 2024, 'N/A', 'Open-source autonomous AI software developer (formerly OpenDevin) that writes code, fixes bugs, and executes terminal commands across codebases.', 'Docker-based sandboxed agent environment supporting various LLM providers.', 'docker run -it --pull=always -e SANDBOX_USER_ID=$(id -u) -v /var/run/docker.sock:/var/run/docker.sock -p 3000:3000 ghcr.io/all-hands-ai/openhands:latest', 'Top open-source agent scores on SWE-bench Verified (53%+ with frontier models).', 'Requires local Docker daemon setup for execution sandboxing.', 'https://github.com/All-Hands-AI/OpenHands', '[{"text":"OpenHands Repository","url":"https://github.com/All-Hands-AI/OpenHands"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Granola AI', 'Granola', 'AI', 'Productivity', 'Proprietary', 2024, 'Desktop app', 'AI notepad for meetings that combines human typing with customizable LLM transcript enhancement to produce clear, actionable meeting notes without intrusive bots.', 'Local audio capture + Whisper transcription + fine-tuned LLM synthesis.', 'Launch Granola on Mac during a Zoom or Google Meet call, take quick notes, and click enhance.', 'Praised by thousands of founders and executives for non-intrusive bot-free note taking.', 'Currently macOS native application.', 'https://www.granola.ai', '[{"text":"Granola","url":"https://www.granola.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Superwhisper', 'Superwhisper', 'AI', 'Productivity', 'Proprietary', 2024, 'Local app', 'Privacy-first local AI voice dictation app for macOS and iOS that transcribes speech into text in any application using local Whisper models with zero latency.', 'On-device Apple Silicon Metal optimized Whisper / Kokoro engine.', 'Press global hotkey, speak naturally, and your voice is instantly transcribed and punctuated into the active cursor.', '100% offline local privacy with near-instant transcript rendering.', 'macOS / iOS ecosystem focus.', 'https://superwhisper.com', '[{"text":"Superwhisper","url":"https://superwhisper.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Phind', 'Phind', 'AI', 'AI Coding', 'Proprietary', 2023, 'N/A', 'AI search engine and pair programmer tailored specifically for developers, providing cited code snippets, documentation references, and terminal debugging.', 'Custom 70B MoE search model paired with live web and documentation scraping index.', 'Visit phind.com and query "How to configure SSL in NGINX reverse proxy with Certbot in Docker".', 'High developer satisfaction for complex programming queries and library documentation search.', 'Focused on technical and developer search queries.', 'https://www.phind.com', '[{"text":"Phind","url":"https://www.phind.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Krea AI', 'Krea AI', 'AI', 'Image Generation', 'Proprietary', 2024, 'N/A', 'Real-time generative AI canvas and video creation tool allowing creators to generate and refine images and video with real-time brush strokes and prompt feedback.', 'Real-time latent diffusion pipeline with sub-100ms screen rendering canvas.', 'Open krea.ai, draw shapes on the left canvas, and see photorealistic 4k renders update live on the right.', 'Sub-100ms interactive visual generation loop.', 'Requires fast internet connection for real-time web canvas streaming.', 'https://www.krea.ai', '[{"text":"Krea AI","url":"https://www.krea.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Glean', 'Glean Technologies', 'AI', 'Productivity', 'Proprietary', 2024, 'Enterprise Cloud', 'Enterprise AI work assistant and enterprise search platform that connects across Google Workspace, Slack, Jira, GitHub, and Microsoft 365 with role-based permissions.', 'Enterprise knowledge graph with vector retrieval and semantic permission enforcement.', 'Ask Glean: "What is the status of project Orion and who is leading the security audit?"', 'Enterprise standard for trusted workplace search and LLM grounding across corporate apps.', 'Requires enterprise corporate deployment and IT administrator configuration.', 'https://www.glean.com', '[{"text":"Glean Enterprise Search","url":"https://www.glean.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GPT-4o', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'OpenAI''s fastest and most advanced flagship model, featuring native multimodal capabilities across text, vision, and audio in real-time.', 'Transformer-based, natively multimodal omni-model.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[{"role": "user", "content": "Hello!"}]
)', 'MMLU: 88.7%, HumanEval: 90.2%', 'Requires subscription for high limits, proprietary API, can hallucinate facts.', 'https://openai.com/chatgpt', '[{"text":"GPT-4o Announcement","url":"https://openai.com/index/hello-gpt-4o/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude 3.5 Sonnet', 'Anthropic', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Anthropic''s highly capable and exceptionally fast language model, known for advanced coding abilities, nuanced reasoning, and the interactive ''Artifacts'' UI.', 'Transformer-based LLM with Constitutional AI training.', 'import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
  model="claude-3-5-sonnet-20240620",
  max_tokens=1000,
  messages=[{"role": "user", "content": "Write a React component."}]
)', 'MMLU: 88.3%, HumanEval: 92.0%', 'Proprietary API, strict safety filters can sometimes refuse benign prompts.', 'https://www.anthropic.com/claude', '[{"text":"Claude 3.5 Sonnet Release","url":"https://www.anthropic.com/news/claude-3-5-sonnet"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude 3 Opus', 'Anthropic', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Anthropic''s most powerful model for complex analysis, long documents, and nuanced reasoning tasks requiring deep comprehension.', 'Transformer-based LLM with Constitutional AI and RLHF training.', 'import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
  model="claude-3-opus-20240229",
  max_tokens=2048,
  messages=[{"role": "user", "content": "Analyze this research paper."}]
)', 'MMLU: 86.8%, GPQA: 50.4%', 'Slower and more expensive than Sonnet, proprietary API.', 'https://www.anthropic.com/claude', '[{"text":"Claude 3 Model Card","url":"https://www.anthropic.com/news/claude-3-family"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gemini 1.5 Pro', 'Google DeepMind', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Google''s flagship multimodal model featuring a massive context window of up to 2 million tokens, allowing it to process hours of video, audio, and vast codebases.', 'Mixture-of-Experts (MoE) transformer architecture.', 'import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel(''gemini-1.5-pro'')
response = model.generate_content("Summarize this 1000-page PDF.")', 'MMLU: 85.9%, MATH: 67.7%', 'Proprietary API, performance can vary on extremely short-context logic puzzles.', 'https://deepmind.google/technologies/gemini/', '[{"text":"Gemini 1.5 Pro Technical Paper","url":"https://arxiv.org/abs/2403.05530"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gemini 1.5 Flash', 'Google DeepMind', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Google''s lightweight, fast multimodal model optimized for high-volume tasks with a 1M token context window at lower cost.', 'Distilled MoE transformer, optimized for speed and efficiency.', 'import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel(''gemini-1.5-flash'')
response = model.generate_content("Summarize this article quickly.")', 'MMLU: 78.9%, significantly faster than Pro', 'Less capable than Gemini 1.5 Pro on complex reasoning tasks.', 'https://deepmind.google/technologies/gemini/flash/', '[{"text":"Gemini 1.5 Flash Announcement","url":"https://deepmind.google/technologies/gemini/flash/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3 (70B)', 'Meta AI', 'Model', 'NLP', 'Meta Llama 3 License', 2024, '70B params', 'Meta''s powerful open-weights language model, offering near-proprietary performance while remaining free to download and run locally.', 'Optimized Transformer decoder architecture trained on 15T tokens.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-70B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-70B-Instruct")', 'MMLU: 82.0%, HumanEval: 81.7%', 'Requires substantial GPU VRAM to run locally, lacks native vision/audio.', 'https://llama.meta.com/', '[{"text":"Introducing Meta Llama 3","url":"https://ai.meta.com/blog/meta-llama-3/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3 (8B)', 'Meta AI', 'Model', 'NLP', 'Meta Llama 3 License', 2024, '8B params', 'Meta''s compact open-weights model designed to run efficiently on consumer hardware while retaining strong instruction-following capabilities.', 'Transformer decoder with grouped query attention trained on 15T tokens.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")', 'MMLU: 66.6%, HumanEval: 62.2%', 'Less capable than larger models, struggles with complex multi-step reasoning.', 'https://llama.meta.com/', '[{"text":"Introducing Meta Llama 3","url":"https://ai.meta.com/blog/meta-llama-3/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mistral 7B', 'Mistral AI', 'Model', 'NLP', 'Apache-2.0', 2023, '7B params', 'A highly efficient 7B parameter open-source model that outperforms Llama 2 13B on most benchmarks using sliding window attention and grouped query attention.', 'Transformer decoder with sliding window attention (SWA) and grouped query attention (GQA).', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")', 'MMLU: 60.1%, outperforms Llama 2 13B on most tasks', 'Smaller size limits complex reasoning, no native multimodal support.', 'https://mistral.ai/', '[{"text":"Mistral 7B Paper","url":"https://arxiv.org/abs/2310.06825"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mixtral 8x7B', 'Mistral AI', 'Model', 'NLP', 'Apache-2.0', 2023, '46.7B total params (12.9B active)', 'Mistral AI''s sparse mixture-of-experts model that uses 8 expert networks but only activates 2 per token, delivering 70B-class performance at lower inference cost.', 'Sparse Mixture-of-Experts (SMoE) with 8 expert FFN layers, activating 2 per token.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("mistralai/Mixtral-8x7B-Instruct-v0.1")
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mixtral-8x7B-Instruct-v0.1")', 'MMLU: 70.6%, HumanEval: 40.2%', 'Large total parameter count, complex deployment for MoE routing.', 'https://mistral.ai/', '[{"text":"Mixtral of Experts Paper","url":"https://arxiv.org/abs/2401.04088"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mistral Large', 'Mistral AI', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Mistral AI''s flagship proprietary model, competitive with GPT-4 on reasoning, coding, and multilingual tasks.', 'Large-scale transformer with advanced instruction tuning.', 'from mistralai.client import MistralClient
client = MistralClient(api_key="YOUR_API_KEY")
response = client.chat(
  model="mistral-large-latest",
  messages=[{"role": "user", "content": "Explain quantum entanglement."}]
)', 'MMLU: 81.2%, MATH: 45.0%', 'Proprietary API, pay-per-use pricing.', 'https://mistral.ai/news/mistral-large/', '[{"text":"Mistral Large Announcement","url":"https://mistral.ai/news/mistral-large/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Command R+', 'Cohere', 'Model', 'NLP', 'Proprietary', 2024, '104B params', 'Cohere''s enterprise-grade LLM optimized for RAG (Retrieval-Augmented Generation) and tool use, with strong multilingual support across 10 languages.', 'Transformer with specialized grounded generation training for RAG workflows.', 'import cohere
co = cohere.Client("YOUR_API_KEY")
response = co.chat(
  model="command-r-plus",
  message="What are the latest trends in AI?",
  documents=[{"text": "...your documents here..."}]
)', 'MMLU: 75.7%, strong RAG and tool use performance', 'Proprietary, optimized for enterprise RAG — may underperform on general chat.', 'https://cohere.com/command', '[{"text":"Command R+ Announcement","url":"https://cohere.com/blog/command-r-plus-microsoft-azure"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Phi-3 Mini', 'Microsoft', 'Model', 'NLP', 'MIT', 2024, '3.8B params', 'Microsoft''s compact 3.8B parameter model that punches far above its weight class, outperforming models 5x its size on reasoning benchmarks.', 'Dense transformer decoder trained on heavily curated ''textbook-quality'' data.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-4k-instruct")
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")', 'MMLU: 68.8%, outperforms Mistral 7B on many tasks', 'Small size limits knowledge breadth, not suitable for long-form tasks.', 'https://azure.microsoft.com/en-us/products/phi-3', '[{"text":"Phi-3 Technical Report","url":"https://arxiv.org/abs/2404.14219"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Qwen2 (72B)', 'Alibaba Cloud', 'Model', 'NLP', 'Qwen License', 2024, '72B params', 'Alibaba''s powerful open-weights model series competitive with leading frontier models, with strong multilingual and coding capabilities.', 'Transformer with GQA, long-context support up to 128K tokens.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2-72B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2-72B-Instruct")', 'MMLU: 84.2%, HumanEval: 86.0%', 'Large VRAM requirement for local inference, license restrictions for commercial use.', 'https://qwenlm.github.io/', '[{"text":"Qwen2 Technical Report","url":"https://arxiv.org/abs/2407.10671"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-V2', 'DeepSeek AI', 'Model', 'NLP', 'DeepSeek License', 2024, '236B total (21B active)', 'DeepSeek''s efficient MoE model with 236B total parameters but only 21B active, offering GPT-4 class performance at dramatically lower inference cost.', 'Multi-head Latent Attention (MLA) + DeepSeekMoE architecture.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-V2")
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-V2", trust_remote_code=True)', 'MMLU: 78.5%, strong on math and code', 'Complex MoE deployment, license restricts certain commercial uses.', 'https://www.deepseek.com/', '[{"text":"DeepSeek-V2 Paper","url":"https://arxiv.org/abs/2405.04434"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('o1 (OpenAI)', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'OpenAI''s reasoning-focused model that ''thinks before it answers'' using chain-of-thought reasoning, excelling at math, science, and coding problems.', 'Large-scale transformer with reinforcement learning on chain-of-thought reasoning traces.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="o1-preview",
  messages=[{"role": "user", "content": "Solve this complex math proof."}]
)', 'AIME: 83.3%, GPQA Diamond: 78.0%', 'Slower than GPT-4o due to extended thinking, no image output, higher cost.', 'https://openai.com/o1', '[{"text":"OpenAI o1 System Card","url":"https://openai.com/index/openai-o1-system-card/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Grok-1', 'xAI', 'Model', 'NLP', 'Apache-2.0', 2024, '314B total (86B active per token)', 'xAI''s open-weights MoE language model, the first large model from Elon Musk''s AI company, trained with a focus on real-time information and humor.', 'Sparse MoE transformer with 8 experts.', '# Grok-1 weights available on HuggingFace
# Run locally with sufficient GPU cluster
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("xai-org/grok-1")', 'MMLU: 73%, HumanEval: 63.2%', 'Extremely large model requiring significant compute, not production-API accessible.', 'https://x.ai/', '[{"text":"Grok-1 Release","url":"https://x.ai/blog/grok-os"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3.1 (405B)', 'Meta AI', 'Model', 'NLP', 'Llama 3.1 Community License', 2024, '405B params', 'Meta''s flagship open-weights model and the first open model to rival top proprietary models like GPT-4o and Claude 3.5 Sonnet across general knowledge, steerability, math, tool use, and multilingual translation.', 'Optimized transformer decoder architecture trained on 15T tokens with 128K context window.', 'from transformers import pipeline
pipe = pipeline("text-generation", model="meta-llama/Meta-Llama-3.1-405B-Instruct")
pipe("Hello world!")', 'MMLU: 88.6%, HumanEval: 89.0%, MATH: 73.8%', 'Massive hardware requirements for local inference due to 405B size.', 'https://llama.meta.com/', '[{"text":"Llama 3.1 Announcement","url":"https://ai.meta.com/blog/meta-llama-3-1/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GPT-4o mini', 'OpenAI', 'Model', 'Multimodal', 'Proprietary', 2024, 'Unknown', 'OpenAI''s most cost-efficient small model, replacing GPT-3.5 Turbo, offering significantly higher intelligence, broader multimodal capabilities, and a 128K context window at a fraction of the cost.', 'Transformer-based, natively multimodal omni-model.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[{"role": "user", "content": "Hello!"}]
)', 'MMLU: 82.0%, HumanEval: 87.0%', 'Less capable on highly complex reasoning tasks compared to GPT-4o.', 'https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/', '[{"text":"GPT-4o mini Announcement","url":"https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude 3 Haiku', 'Anthropic', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'Anthropic''s fastest and most compact model for near-instant responsiveness, ideal for quick queries and high-volume tasks.', 'Transformer-based LLM optimized for speed.', 'import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
  model="claude-3-haiku-20240307",
  max_tokens=1000,
  messages=[{"role": "user", "content": "Summarize this quickly."}]
)', 'MMLU: 75.2%, HumanEval: 75.9%', 'Lacks the deep reasoning capabilities of Sonnet and Opus.', 'https://www.anthropic.com/claude', '[{"text":"Claude 3 Model Card","url":"https://www.anthropic.com/news/claude-3-family"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gemma 2 (27B)', 'Google DeepMind', 'Model', 'NLP', 'Gemma License', 2024, '27B params', 'Google''s open-weights model built from the same research and technology as the Gemini models, offering class-leading performance for its size.', 'Transformer decoder with sliding window attention and soft-capping.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("google/gemma-2-27b-it")
model = AutoModelForCausalLM.from_pretrained("google/gemma-2-27b-it")', 'MMLU: 81.5%, HumanEval: 71.5%', 'Commercial use permitted but subject to the Gemma license terms.', 'https://ai.google.dev/gemma', '[{"text":"Gemma 2 Announcement","url":"https://blog.google/technology/developers/google-gemma-2/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Grok-2', 'xAI', 'Model', 'Multimodal', 'Proprietary', 2024, 'Unknown', 'xAI''s frontier model demonstrating significant improvements in reasoning, coding, and mathematical capabilities, integrated with real-time X (Twitter) data and image generation.', 'Transformer-based multimodal LLM.', '# Accessed via X Premium subscription or xAI API
import os
from openai import OpenAI
client = OpenAI(api_key=os.environ.get("XAI_API_KEY"), base_url="https://api.x.ai/v1")
response = client.chat.completions.create(model="grok-2-latest", messages=[{"role": "user", "content": "Hi"}])', 'Competitive with GPT-4o and Claude 3.5 Sonnet on LMSYS Chatbot Arena.', 'Requires subscription to X or API access, proprietary.', 'https://x.ai/', '[{"text":"Grok-2 Announcement","url":"https://x.ai/blog/grok-2"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GPT-4', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2023, 'Unknown (estimated 1.76T params)', 'Advanced large language model with multimodal capabilities for text and image understanding.', 'Transformer-based decoder architecture with advanced reasoning capabilities.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="gpt-4",
  messages=[{"role": "user", "content": "Hello!"}]
)', 'MMLU: 86.4%, HumanEval: 67%', 'Can hallucinate, expensive to run, proprietary with limited access.', 'https://openai.com/gpt-4', '[{"text":"Official GPT-4 Technical Report","url":"https://openai.com/research/gpt-4"},{"text":"GPT-4 API Documentation","url":"https://platform.openai.com/docs"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GPT-3.5 Turbo', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2022, 'Unknown (~175B params)', 'OpenAI''s workhorse model balancing performance and speed, widely used for chatbots and text generation at scale.', 'Transformer decoder fine-tuned with RLHF for instruction following.', 'from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user", "content": "Hello!"}]
)', 'MMLU: 70.0%, HumanEval: 48.1%', 'Knowledge cutoff, prone to hallucination on niche topics.', 'https://platform.openai.com/docs/models/gpt-3-5-turbo', '[{"text":"ChatGPT Blog Post","url":"https://openai.com/blog/chatgpt"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GPT-3', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2020, '175B params', 'The landmark 175B parameter autoregressive language model that demonstrated few-shot learning and ignited the modern LLM era.', 'Transformer decoder with 96 attention layers.', '# GPT-3 is accessed via OpenAI''s legacy completions API
from openai import OpenAI
client = OpenAI()
response = client.completions.create(
  model="text-davinci-003",
  prompt="Translate to French: Hello, world!",
  max_tokens=60
)', 'SuperGLUE: 71.8% (few-shot)', 'Largely superseded, expensive, no chat interface natively.', 'https://openai.com/research/language-models-are-few-shot-learners', '[{"text":"Brown et al. (2020) - GPT-3 Paper","url":"https://arxiv.org/abs/2005.14165"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LLaMA 2', 'Meta AI', 'Model', 'NLP', 'Llama 2 Community License', 2023, '7B to 70B params', 'Meta''s second-generation open foundation model family (7B–70B) with a permissive commercial license, trained on 2T tokens.', 'Transformer decoder with grouped query attention and RoPE embeddings.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b-chat-hf")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-70b-chat-hf")', 'MMLU: 68.9% (70B), HumanEval: 29.9% (70B)', 'Weaker than Llama 3 on most tasks, 4096 max context window.', 'https://ai.meta.com/llama/', '[{"text":"Touvron et al. (2023) - Llama 2 Paper","url":"https://arxiv.org/abs/2307.09288"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LLaMA', 'Meta AI', 'Model', 'NLP', 'LLaMA License (non-commercial)', 2023, '7B to 65B params', 'Open foundation language models from 7B to 65B parameters that sparked the open-source LLM revolution.', 'Transformer decoder with optimizations for efficiency.', 'from transformers import LlamaForCausalLM, LlamaTokenizer
model = LlamaForCausalLM.from_pretrained("meta-llama/Llama-2-7b")
tokenizer = LlamaTokenizer.from_pretrained("meta-llama/Llama-2-7b")', '70B model competitive with GPT-3.5 on many tasks', 'Restricted commercial use, requires significant compute.', 'https://ai.meta.com/llama/', '[{"text":"Touvron et al. (2023) - LLaMA Paper","url":"https://arxiv.org/abs/2302.13971"},{"text":"Meta AI Official LLaMA Page","url":"https://ai.meta.com/llama/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('BERT', 'Google', 'Model', 'NLP', 'Apache-2.0', 2018, 'Base: 110M params, Large: 340M params', 'Bidirectional Encoder Representations from Transformers for NLP pre-training.', 'Transformer encoder with bidirectional attention, pre-trained with masked language modeling.', 'from transformers import BertTokenizer, BertModel
tokenizer = BertTokenizer.from_pretrained(''bert-base-uncased'')
model = BertModel.from_pretrained(''bert-base-uncased'')', 'GLUE: 80.5% (base), SQuAD: 93.2 F1', 'Limited to 512 tokens, slower than newer models.', 'https://github.com/google-research/bert', '[{"text":"Devlin et al. (2018) - BERT Paper","url":"https://arxiv.org/abs/1810.04805"},{"text":"Official GitHub Repository","url":"https://github.com/google-research/bert"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('RoBERTa', 'Facebook AI Research', 'Model', 'NLP', 'MIT', 2019, 'Base: 125M params, Large: 355M params', 'A robustly optimized BERT pretraining approach that surpassed BERT by training longer with more data and removing next-sentence prediction.', 'Transformer encoder, same as BERT but with dynamic masking and longer training.', 'from transformers import RobertaTokenizer, RobertaModel
tokenizer = RobertaTokenizer.from_pretrained(''roberta-base'')
model = RobertaModel.from_pretrained(''roberta-base'')', 'GLUE: 88.5 (large), SQuAD 2.0: 89.4 F1', 'Still limited to 512 tokens, encoder-only not generative.', 'https://github.com/facebookresearch/fairseq/tree/main/examples/roberta', '[{"text":"Liu et al. (2019) - RoBERTa Paper","url":"https://arxiv.org/abs/1907.11692"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('T5', 'Google', 'Model', 'NLP', 'Apache-2.0', 2019, 'Small (60M) to 11B params', 'Text-To-Text Transfer Transformer — Google''s unified framework that converts every NLP task into a text-to-text format.', 'Encoder-decoder transformer trained with a span-corruption pre-training objective.', 'from transformers import T5Tokenizer, T5ForConditionalGeneration
tokenizer = T5Tokenizer.from_pretrained("t5-base")
model = T5ForConditionalGeneration.from_pretrained("t5-base")
input_ids = tokenizer("translate English to French: Hello world", return_tensors="pt").input_ids', 'SuperGLUE: 88.9 (11B), GLUE: 90.3 (11B)', 'Encoder-decoder architecture slower than decoder-only for generation tasks.', 'https://github.com/google-research/text-to-text-transfer-transformer', '[{"text":"Raffel et al. (2019) - T5 Paper","url":"https://arxiv.org/abs/1910.10683"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('PaLM 2', 'Google', 'Model', 'NLP', 'Proprietary', 2023, 'Unknown (multiple sizes: Gecko, Otter, Bison, Unicorn)', 'Google''s multilingual, reasoning-focused language model powering Bard and many Google Workspace AI features.', 'Transformer trained with a compute-optimal approach across multilingual and code data.', '# Access via Google AI Studio or Vertex AI
import vertexai
from vertexai.language_models import TextGenerationModel
vertexai.init(project="YOUR_PROJECT", location="us-central1")
model = TextGenerationModel.from_pretrained("text-bison@002")
response = model.predict("Write a poem about AI.")', 'MMLU: 78.3%, multilingual reasoning leader in 2023', 'Superseded by Gemini, proprietary API.', 'https://ai.google/discover/palm2', '[{"text":"PaLM 2 Technical Report","url":"https://arxiv.org/abs/2305.10403"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Falcon 180B', 'Technology Innovation Institute (TII)', 'Model', 'NLP', 'Falcon-180B TII License', 2023, '180B params', 'TII''s massive open-source 180B parameter model, one of the largest publicly available LLMs trained on the RefinedWeb dataset.', 'Causal decoder-only transformer with multi-query attention.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("tiiuae/falcon-180B-chat")
model = AutoModelForCausalLM.from_pretrained("tiiuae/falcon-180B-chat", trust_remote_code=True)', 'MMLU: 70.4%, competitive with PaLM 2-L', 'Requires massive GPU cluster, commercial use needs separate license.', 'https://falconllm.tii.ae/', '[{"text":"Falcon 180B Release","url":"https://huggingface.co/tiiuae/falcon-180B"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Vicuna-13B', 'LMSYS', 'Model', 'NLP', 'Non-commercial (based on LLaMA license)', 2023, '13B params', 'A fine-tuned LLaMA model trained on ShareGPT conversations, achieving 90% of ChatGPT quality according to GPT-4 evaluations.', 'LLaMA decoder fine-tuned on ~70K user-shared ChatGPT conversations.', 'from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("lmsys/vicuna-13b-v1.5")
tokenizer = AutoTokenizer.from_pretrained("lmsys/vicuna-13b-v1.5")', 'GPT-4 judged 90% of ChatGPT quality on open questions', 'Non-commercial, hallucinates more than proprietary models.', 'https://lmsys.org/blog/2023-03-30-vicuna/', '[{"text":"Vicuna Blog Post","url":"https://lmsys.org/blog/2023-03-30-vicuna/"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Alpaca', 'Stanford CRFM', 'Model', 'NLP', 'Non-commercial (CC BY NC 4.0)', 2023, '7B params', 'Stanford''s instruction-tuned model based on LLaMA 7B, fine-tuned for ~$600 using Self-Instruct data generated from GPT-3.5.', 'LLaMA fine-tuned on 52K instruction-following examples from GPT-3.5.', '# Weights available on HuggingFace
from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("tatsu-lab/alpaca-7b-wdiff")
tokenizer = AutoTokenizer.from_pretrained("tatsu-lab/alpaca-7b-wdiff")', 'Comparable to GPT-3.5 text-davinci-003 in human evaluation', 'Non-commercial license, now largely superseded by better open models.', 'https://crfm.stanford.edu/2023/03/13/alpaca.html', '[{"text":"Alpaca: A Strong Open-Source LLM","url":"https://crfm.stanford.edu/2023/03/13/alpaca.html"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Midjourney v6', 'Midjourney, Inc.', 'Model', 'Computer Vision', 'Proprietary', 2023, 'Unknown', 'A highly advanced text-to-image AI capable of generating photorealistic imagery, complex compositions, and readable text within images.', 'Latent diffusion model.', '# Midjourney does not offer an official public API.
# Usage is primarily through their Discord bot or web interface.
/imagine prompt: A futuristic cyberpunk city in the rain, highly detailed --v 6.0', 'N/A (Subjective visual quality leader)', 'No official API, requires Discord/web interface, paid subscription only.', 'https://www.midjourney.com/', '[{"text":"Midjourney Alpha","url":"https://www.midjourney.com/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Stable Diffusion', 'Stability AI', 'Model', 'Computer Vision', 'CreativeML Open RAIL-M', 2022, '890M params', 'Open-source latent diffusion model for high-quality text-to-image generation.', 'Latent diffusion model with CLIP text encoder and U-Net denoising network.', 'from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2")
image = pipe("a photo of an astronaut on mars").images[0]', 'FID score competitive with DALL-E 2', 'Can produce biased outputs, requires GPU for reasonable speed.', 'https://stability.ai/stable-diffusion', '[{"text":"Rombach et al. (2022) - Latent Diffusion Paper","url":"https://arxiv.org/abs/2112.10752"},{"text":"Stability AI Official Site","url":"https://stability.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Stable Diffusion XL (SDXL)', 'Stability AI', 'Model', 'Computer Vision', 'CreativeML Open RAIL++-M', 2023, '3.5B params (base + refiner)', 'An improved latent diffusion model with a larger UNet backbone and a refiner model, producing higher-resolution and more detailed images than SD 1.5/2.x.', 'Dual text encoders (CLIP ViT-L + OpenCLIP ViT-bigG) with larger UNet backbone.', 'from diffusers import DiffusionPipeline
pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0")
image = pipe(prompt="A majestic lion at sunset, 8K").images[0]', 'Significantly higher FID than SD 2.1, preferred in human evaluation', 'Higher VRAM requirement (~12GB), slower than SD 1.5.', 'https://stability.ai/stable-image', '[{"text":"SDXL Paper","url":"https://arxiv.org/abs/2307.01952"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DALL-E 3', 'OpenAI', 'Model', 'Computer Vision', 'Proprietary', 2023, 'Unknown', 'OpenAI''s third-generation text-to-image model with dramatically improved prompt adherence, integrated directly into ChatGPT.', 'Diffusion model with improved text conditioning via a recaptioning technique.', 'from openai import OpenAI
client = OpenAI()
response = client.images.generate(
  model="dall-e-3",
  prompt="A cozy cabin in a snowy forest at night, cinematic lighting",
  size="1024x1024",
  quality="hd"
)', 'Human preference significantly higher than DALL-E 2, SD, and Midjourney v5', 'Proprietary, no local inference, usage policy restrictions.', 'https://openai.com/dall-e-3', '[{"text":"DALL-E 3 Technical Report","url":"https://openai.com/research/dall-e-3"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DALL-E 2', 'OpenAI', 'Model', 'Computer Vision', 'Proprietary', 2022, 'Unknown (3.5B params)', 'OpenAI''s second-generation image model introducing inpainting, outpainting, and variations from text and image inputs.', 'CLIP-guided hierarchical diffusion model with GLIDE as prior.', 'from openai import OpenAI
client = OpenAI()
response = client.images.generate(
  model="dall-e-2",
  prompt="A surrealist painting of a robot reading a book",
  n=1,
  size="1024x1024"
)', 'FID: 10.39 on COCO', 'Superseded by DALL-E 3, limited prompt comprehension vs. newer models.', 'https://openai.com/dall-e-2', '[{"text":"Hierarchical Text-Conditional Image Generation Paper","url":"https://arxiv.org/abs/2204.06125"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('CLIP', 'OpenAI', 'Model', 'Computer Vision', 'MIT', 2021, 'ViT-L/14: 428M params', 'Contrastive Language-Image Pre-training for zero-shot image classification.', 'Dual encoder with vision transformer and text transformer trained contrastively.', 'import clip
model, preprocess = clip.load("ViT-B/32")
image = preprocess(image).unsqueeze(0)
text = clip.tokenize(["a cat", "a dog"])', 'Zero-shot ImageNet: 76.2% top-1', 'Struggles with fine-grained classification, abstract concepts.', 'https://github.com/openai/CLIP', '[{"text":"Radford et al. (2021) - CLIP Paper","url":"https://arxiv.org/abs/2103.00020"},{"text":"Official CLIP Repository","url":"https://github.com/openai/CLIP"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('SAM (Segment Anything Model)', 'Meta AI', 'Model', 'Computer Vision', 'Apache-2.0', 2023, 'ViT-H: 636M params', 'Meta''s foundation model for image segmentation that can segment any object in any image with a single click, point, or text prompt.', 'Vision Transformer image encoder + prompt encoder + mask decoder.', 'from segment_anything import sam_model_registry, SamPredictor
sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)
predictor.set_image(image)
masks, scores, logits = predictor.predict(point_coords=input_point, point_labels=input_label)', 'Zero-shot COCO AP: 46.5% (SAM ViT-H)', 'Does not track objects across frames, not designed for semantic labeling.', 'https://segment-anything.com/', '[{"text":"Kirillov et al. (2023) - SAM Paper","url":"https://arxiv.org/abs/2304.02643"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Whisper', 'OpenAI', 'Model', 'Audio', 'MIT', 2022, 'Large-v3: 1.55B params', 'OpenAI''s robust automatic speech recognition (ASR) model trained on 680K hours of multilingual and multitask supervised web data.', 'Encoder-decoder transformer operating on log-Mel spectrograms.', 'import whisper
model = whisper.load_model("large-v3")
result = model.transcribe("audio.mp3")
print(result["text"])', 'WER competitive with commercial ASR on LibriSpeech', 'Real-time use requires optimization, struggles with heavy accents and rare languages.', 'https://openai.com/research/whisper', '[{"text":"Radford et al. (2022) - Whisper Paper","url":"https://arxiv.org/abs/2212.04356"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ViT (Vision Transformer)', 'Google Brain', 'Model', 'Computer Vision', 'Apache-2.0', 2020, 'ViT-L/16: 307M params', 'The original paper demonstrating that pure transformer architecture, without convolutional layers, achieves state-of-the-art results on image classification.', 'Pure transformer applied to sequences of image patches.', 'from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
processor = ViTImageProcessor.from_pretrained(''google/vit-base-patch16-224'')
model = ViTForImageClassification.from_pretrained(''google/vit-base-patch16-224'')', 'ImageNet top-1: 88.55% (ViT-L/16)', 'Requires large datasets to train from scratch, less data-efficient than CNNs.', 'https://github.com/google-research/vision_transformer', '[{"text":"Dosovitskiy et al. (2020) - ViT Paper","url":"https://arxiv.org/abs/2010.11929"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Sora', 'OpenAI', 'Model', 'Computer Vision', 'Proprietary', 2024, 'Unknown', 'OpenAI''s text-to-video model capable of generating high-quality, minute-long video clips from text descriptions with impressive temporal consistency.', 'Diffusion transformer (DiT) operating on spacetime patches of video.', '# Sora is accessible via ChatGPT Plus/Pro or the OpenAI API
# API access for developers was opened in late 2024
from openai import OpenAI
client = OpenAI()
# See official Sora docs for current API usage', 'N/A — subjective quality; significant leap in video coherence', 'Limited public API access, expensive, struggles with physics simulation.', 'https://openai.com/sora', '[{"text":"Sora Technical Report","url":"https://openai.com/research/video-generation-models-as-world-simulators"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ResNet', 'Microsoft Research', 'Model', 'Computer Vision', 'MIT', 2015, 'ResNet-50: 25M params', 'The residual neural network that introduced skip connections, enabling training of very deep networks (100+ layers) and winning ImageNet 2015.', 'CNN with residual (skip) connections to enable very deep network training.', 'import torchvision.models as models
model = models.resnet50(pretrained=True)
model.eval()', 'ImageNet top-5 error: 3.57% (ensemble)', 'Largely superseded by ViT-based models for top benchmarks.', 'https://arxiv.org/abs/1512.03385', '[{"text":"He et al. (2015) - Deep Residual Learning Paper","url":"https://arxiv.org/abs/1512.03385"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('YOLOv8', 'Ultralytics', 'Model', 'Computer Vision', 'AGPL-3.0', 2023, 'Nano: 3.2M params to Extra-Large: 68.2M params', 'The latest iteration of the You Only Look Once real-time object detection framework, supporting detection, segmentation, pose estimation, and classification.', 'Single-stage detector with an anchor-free head and a CSPDarknet backbone.', 'from ultralytics import YOLO
model = YOLO("yolov8n.pt")
results = model("https://ultralytics.com/images/bus.jpg")
results[0].show()', 'COCO mAP: 53.9% (YOLOv8x)', 'AGPL license may restrict commercial use without purchase.', 'https://github.com/ultralytics/ultralytics', '[{"text":"Ultralytics YOLOv8 Docs","url":"https://docs.ultralytics.com/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Flux.1', 'Black Forest Labs', 'Model', 'Computer Vision', 'Various (Pro: Proprietary, Dev: Non-commercial, Schnell: Apache 2.0)', 2024, '12B params', 'Black Forest Labs'' state-of-the-art suite of text-to-image models (Pro, Dev, Schnell) pushing the boundaries of prompt adherence, visual quality, and image detail.', 'Hybrid architecture of multimodal and parallel diffusion transformer blocks.', '# Via API or locally for open variants
from diffusers import FluxPipeline
import torch
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
image = pipe("A cat holding a sign that says ''Hello World''").images[0]', 'State-of-the-art ELO scores surpassing Midjourney v6 and DALL-E 3 on prompt adherence.', 'High VRAM requirements for local inference of the full 12B model.', 'https://blackforestlabs.ai/', '[{"text":"FLUX.1 Announcement","url":"https://blackforestlabs.ai/announcing-black-forest-labs/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Runway Gen-3 Alpha', 'Runway', 'Model', 'Computer Vision', 'Proprietary', 2024, 'Unknown', 'Runway''s advanced video generation model capable of highly photorealistic, consistent, and controllable video creation from text, images, or video inputs.', 'Large-scale multimodal diffusion transformer trained jointly on video and images.', '# Accessed via Runway web interface or API
# Provide a descriptive prompt to generate high-fidelity video clips.', 'Major improvements in temporal consistency and photorealism over Gen-2.', 'Proprietary, paid service, max generation length limitations.', 'https://runwayml.com/', '[{"text":"Gen-3 Alpha Release","url":"https://runwayml.com/research/introducing-gen-3-alpha"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('MusicGen', 'Meta AI', 'Model', 'Audio', 'CC BY-NC 4.0', 2023, '300M to 3.3B params', 'Meta''s controllable text-to-music model that generates high-quality music from text descriptions or melody conditioning.', 'Transformer-based auto-regressive language model operating on EnCodec audio tokens.', 'from audiocraft.models import MusicGen
model = MusicGen.get_pretrained(''facebook/musicgen-large'')
model.set_generation_params(duration=8)
wav = model.generate(["An upbeat jazz piano with drums"])', 'FAD: 4.93 (large model), Fréchet Audio Distance competitive with MusicLM', 'Non-commercial license, 30-second max duration natively.', 'https://github.com/facebookresearch/audiocraft', '[{"text":"Copet et al. (2023) - MusicGen Paper","url":"https://arxiv.org/abs/2306.05284"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LLaVA', 'University of Wisconsin-Madison & Microsoft', 'Model', 'Multimodal', 'Apache-2.0', 2023, '7B to 34B params', 'Large Language-and-Vision Assistant — an open-source multimodal model that combines a visual encoder with an LLM for general-purpose visual question answering.', 'CLIP visual encoder connected to a Vicuna/Mistral LLM via a linear projection layer.', 'from transformers import LlavaNextProcessor, LlavaNextForConditionalGeneration
processor = LlavaNextProcessor.from_pretrained("llava-hf/llava-v1.6-mistral-7b-hf")
model = LlavaNextForConditionalGeneration.from_pretrained("llava-hf/llava-v1.6-mistral-7b-hf")', 'MMBench: 76.3% (LLaVA-1.6 34B), ScienceQA: 90.92%', 'Vision understanding still behind GPT-4V on complex visual tasks.', 'https://llava-vl.github.io/', '[{"text":"LLaVA Paper","url":"https://arxiv.org/abs/2304.08485"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Suno v3.5', 'Suno', 'Model', 'Audio', 'Proprietary', 2024, 'Unknown', 'State-of-the-art AI music generation model capable of creating full, radio-quality songs with vocals and instrumentation from simple text prompts.', 'Proprietary audio generation architecture.', '# Accessed via Suno web platform or API
# Prompt: "An upbeat pop song about coding late at night"', 'High subjective quality for coherent musical structure and intelligible vocals.', 'Proprietary, max song length limits, potential copyright concerns regarding training data.', 'https://suno.com/', '[{"text":"Suno v3.5 Announcement","url":"https://suno.com/blog/v3-5"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ElevenLabs', 'ElevenLabs', 'Model', 'Audio', 'Proprietary', 2022, 'Unknown', 'Leading AI voice generation platform offering extremely natural, emotive text-to-speech, voice cloning, and dubbing across multiple languages.', 'Proprietary deep learning model for speech synthesis.', 'import requests
url = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
headers = {"xi-api-key": "YOUR_API_KEY", "Content-Type": "application/json"}
data = {"text": "Hello, world!", "model_id": "eleven_multilingual_v2"}
response = requests.post(url, json=data, headers=headers)', 'Industry-leading MOS (Mean Opinion Score) for voice naturalness.', 'Proprietary, paid API for higher usage or commercial rights.', 'https://elevenlabs.io/', '[{"text":"ElevenLabs Official Site","url":"https://elevenlabs.io/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Llama 3.2 (90B Vision)', 'Meta AI', 'Model', 'Multimodal', 'Llama 3.2 Community License', 2024, '90B params', 'Meta''s open-weights multimodal model, supporting high-resolution image reasoning alongside top-tier text capabilities.', 'Transformer decoder integrated with vision encoder via cross-attention.', 'from transformers import MllamaForConditionalGeneration, AutoProcessor
model = MllamaForConditionalGeneration.from_pretrained("meta-llama/Llama-3.2-90B-Vision-Instruct")
processor = AutoProcessor.from_pretrained("meta-llama/Llama-3.2-90B-Vision-Instruct")', 'Highly competitive with closed models on MMMU and MathVista.', 'Significant hardware required for local inference.', 'https://llama.meta.com/', '[{"text":"Llama 3.2 Announcement","url":"https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Codex', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2021, '12B params', 'OpenAI''s code-specialized GPT model that powers GitHub Copilot, fine-tuned on billions of lines of public code.', 'GPT-3 fine-tuned on 159GB of GitHub code across 54 programming languages.', '# Codex is accessed via the OpenAI Completions API (deprecated in favor of GPT-4)
from openai import OpenAI
client = OpenAI()
response = client.completions.create(
  model="code-davinci-002",
  prompt="# Python function to sort a list\ndef sort_list(",
  max_tokens=100
)', 'HumanEval: 72% pass@100', 'Deprecated — succeeded by GPT-4, can generate insecure code.', 'https://openai.com/blog/openai-codex', '[{"text":"Chen et al. (2021) - Codex Paper","url":"https://arxiv.org/abs/2107.03374"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Code Llama', 'Meta AI', 'Model', 'NLP', 'Llama 2 Community License', 2023, '7B to 70B params', 'Meta''s family of open-source code-specialized models (7B–70B) built on Llama 2, supporting code generation, infilling, and instruction-following for 100+ programming languages.', 'Llama 2 fine-tuned on 500B code tokens, with infilling and long-context capability.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("meta-llama/CodeLlama-34b-Instruct-hf")
model = AutoModelForCausalLM.from_pretrained("meta-llama/CodeLlama-34b-Instruct-hf")', 'HumanEval: 53.7% (34B), pass@1', 'Commercial use constraints from Llama 2 license.', 'https://ai.meta.com/blog/code-llama-large-language-model-coding/', '[{"text":"Code Llama Paper","url":"https://arxiv.org/abs/2308.12950"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('StarCoder2', 'BigCode / HuggingFace', 'Model', 'NLP', 'BigCode OpenRAIL-M v1', 2024, '3B to 15B params', 'BigCode''s open state-of-the-art code model trained on 619 programming languages with permissive licensing, supporting infilling and 16K context.', 'Transformer decoder with multi-query attention and Fill-in-the-Middle (FIM) training.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("bigcode/starcoder2-15b")
model = AutoModelForCausalLM.from_pretrained("bigcode/starcoder2-15b")', 'HumanEval: 46.3% (15B pass@1), best open model at time of release', 'Not an instruction-tuned chat model by default, requires fine-tuning for dialogue.', 'https://github.com/bigcode-project/starcoder2', '[{"text":"StarCoder2 Paper","url":"https://arxiv.org/abs/2402.19173"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek-Coder', 'DeepSeek AI', 'Model', 'NLP', 'DeepSeek License', 2023, '1.3B to 33B params', 'DeepSeek''s top-performing open-source code model series (1.3B–33B) that outperforms GPT-3.5 Turbo on many coding benchmarks.', 'Transformer decoder trained on 2T tokens across 87 programming languages.', 'from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-33b-instruct")
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/deepseek-coder-33b-instruct")', 'HumanEval: 79.3% (33B), outperforms GPT-3.5 Turbo', 'License restricts certain commercial applications.', 'https://github.com/deepseek-ai/DeepSeek-Coder', '[{"text":"DeepSeek-Coder Paper","url":"https://arxiv.org/abs/2401.14196"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('text-embedding-3-large', 'OpenAI', 'Model', 'NLP', 'Proprietary', 2024, 'Unknown', 'OpenAI''s most capable text embedding model, with improved multilingual performance and flexible dimensionality reduction.', 'Encoder-only transformer producing dense vector representations.', 'from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(
  input="Your text string goes here",
  model="text-embedding-3-large"
)
embedding = response.data[0].embedding', 'MTEB: 64.6% average across 56 tasks', 'Proprietary, pay-per-use, no local inference.', 'https://platform.openai.com/docs/guides/embeddings', '[{"text":"New Embedding Models Announcement","url":"https://openai.com/blog/new-embedding-models-and-api-updates"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('E5-Mistral-7B', 'Microsoft', 'Model', 'NLP', 'MIT', 2024, '7B params', 'Microsoft''s state-of-the-art text embedding model based on Mistral 7B, achieving top MTEB scores for retrieval and semantic search tasks.', 'Mistral 7B decoder fine-tuned with contrastive learning for embedding tasks.', 'from sentence_transformers import SentenceTransformer
model = SentenceTransformer("intfloat/e5-mistral-7b-instruct")
embeddings = model.encode(["Hello world", "Bonjour le monde"])', 'MTEB: 66.6% average (top open model at release)', '7B params is large for an embedding model, slower than lighter alternatives.', 'https://arxiv.org/abs/2401.00368', '[{"text":"E5-Mistral Paper","url":"https://arxiv.org/abs/2401.00368"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('PyTorch', 'Meta AI', 'Framework', 'MLOps', 'BSD-3-Clause', 2016, 'N/A', 'Open-source machine learning framework with dynamic computation graphs.', 'Python-first framework with automatic differentiation and GPU acceleration.', 'import torch
import torch.nn as nn
model = nn.Sequential(
  nn.Linear(10, 20),
  nn.ReLU(),
  nn.Linear(20, 1)
)', 'Most popular framework for research (60%+ papers)', 'More verbose than high-level frameworks, deployment can be complex.', 'https://pytorch.org', '[{"text":"PyTorch Official Documentation","url":"https://pytorch.org/docs"},{"text":"GitHub Repository","url":"https://github.com/pytorch/pytorch"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('TensorFlow', 'Google Brain', 'Framework', 'MLOps', 'Apache-2.0', 2015, 'N/A', 'Google''s end-to-end open-source ML platform, widely used in production for its robust serving infrastructure and mobile deployment via TensorFlow Lite.', 'Graph-based computation framework with eager execution support, Keras high-level API.', 'import tensorflow as tf
model = tf.keras.Sequential([
  tf.keras.layers.Dense(64, activation=''relu''),
  tf.keras.layers.Dense(10, activation=''softmax'')
])
model.compile(optimizer=''adam'', loss=''categorical_crossentropy'', metrics=[''accuracy''])', 'Dominant framework for production ML deployments', 'More complex debugging than PyTorch, less dominant in research community.', 'https://www.tensorflow.org', '[{"text":"TensorFlow Official Site","url":"https://www.tensorflow.org"},{"text":"GitHub Repository","url":"https://github.com/tensorflow/tensorflow"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('JAX', 'Google DeepMind', 'Framework', 'MLOps', 'Apache-2.0', 2018, 'N/A', 'Google''s high-performance numerical computing library combining Autograd and XLA, enabling GPU/TPU-accelerated ML research with functional transformations.', 'NumPy-compatible API with JIT compilation, vectorization (vmap), and automatic differentiation (grad).', 'import jax
import jax.numpy as jnp

@jax.jit
def predict(params, x):
  return jnp.dot(x, params[''w'']) + params[''b'']

grad_fn = jax.grad(lambda params, x, y: jnp.mean((predict(params, x) - y)**2))', 'Powers many state-of-the-art research papers at Google DeepMind', 'Steeper learning curve, functional style requires adapting existing code.', 'https://github.com/google/jax', '[{"text":"JAX GitHub Repository","url":"https://github.com/google/jax"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LangChain', 'LangChain AI', 'Framework', 'MLOps', 'MIT', 2022, 'N/A', 'A popular framework for building LLM-powered applications with chains, agents, memory, and tool integrations.', 'Modular Python/JS library with abstractions for chains, agents, retrievers, and memory.', 'from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

model = ChatOpenAI(model="gpt-4o")
response = model.invoke([HumanMessage(content="Tell me a joke.")])', 'Most starred LLM framework on GitHub (85K+ stars)', 'Rapidly evolving API, abstractions can be opaque, sometimes overengineered for simple tasks.', 'https://www.langchain.com/', '[{"text":"LangChain Documentation","url":"https://python.langchain.com/docs/get_started/introduction"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LlamaIndex', 'LlamaIndex', 'Framework', 'MLOps', 'MIT', 2022, 'N/A', 'A data framework for LLM applications focused on ingesting, structuring, and accessing private or domain-specific data for RAG applications.', 'Data connectors + indexing strategies + query engines for RAG pipelines.', 'from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")', 'Leading framework for RAG-based applications', 'Can be complex for advanced configurations, performance depends on vector store choice.', 'https://www.llamaindex.ai/', '[{"text":"LlamaIndex Documentation","url":"https://docs.llamaindex.ai/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Scikit-learn', 'Community / INRIA', 'Framework', 'MLOps', 'BSD-3-Clause', 2007, 'N/A', 'The go-to Python library for classical machine learning with a consistent, easy-to-use API for classification, regression, clustering, and preprocessing.', 'Python library built on NumPy, SciPy, and Matplotlib with estimator API pattern.', 'from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)
print(clf.score(X_test, y_test))', 'N/A — foundational library, not benchmarked as a model', 'Not designed for deep learning or GPU-accelerated large-scale training.', 'https://scikit-learn.org', '[{"text":"Pedregosa et al. (2011) - Scikit-learn Paper","url":"https://arxiv.org/abs/1201.0490"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Keras', 'Google', 'Framework', 'MLOps', 'Apache-2.0', 2015, 'N/A', 'A high-level deep learning API that runs on top of TensorFlow, JAX, or PyTorch, designed for fast experimentation with a human-centric design philosophy.', 'Multi-backend deep learning API (TF/JAX/PyTorch) with layer, model, and optimizer abstractions.', 'import keras
model = keras.Sequential([
  keras.layers.Dense(64, activation=''relu''),
  keras.layers.Dense(1, activation=''sigmoid'')
])
model.compile(optimizer=''adam'', loss=''binary_crossentropy'')
model.fit(x_train, y_train, epochs=10)', 'N/A — high-level API; backend-dependent performance', 'Less flexibility than raw PyTorch for custom training loops.', 'https://keras.io', '[{"text":"Keras Official Documentation","url":"https://keras.io/guides/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Ollama', 'Ollama', 'Framework', 'MLOps', 'MIT', 2023, 'N/A', 'A tool for running large language models locally on your Mac, Linux, or Windows machine with a simple CLI and REST API.', 'Go-based server wrapping llama.cpp inference backend with a Docker-like model management CLI.', '# Install and run from terminal
$ ollama pull llama3
$ ollama run llama3

# Or use the REST API
import requests
response = requests.post(''http://localhost:11434/api/generate'',
  json={"model": "llama3", "prompt": "Why is the sky blue?", "stream": False})', 'N/A — inference speed depends on hardware', 'Local hardware constraints limit model size, not for production serving at scale.', 'https://ollama.com/', '[{"text":"Ollama GitHub","url":"https://github.com/ollama/ollama"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('vLLM', 'UC Berkeley', 'Framework', 'MLOps', 'Apache-2.0', 2023, 'N/A', 'A fast and easy-to-use library for LLM inference and serving, featuring PagedAttention for near-optimal GPU memory management.', 'PagedAttention memory manager with continuous batching for high-throughput serving.', 'from vllm import LLM, SamplingParams
llm = LLM(model="meta-llama/Meta-Llama-3-8B-Instruct")
params = SamplingParams(temperature=0.8, top_p=0.95)
outputs = llm.generate(["Tell me a fun fact about space."], params)', 'Up to 24x higher throughput than HuggingFace Transformers', 'Primarily optimized for NVIDIA GPUs, less support for AMD/Apple Silicon.', 'https://github.com/vllm-project/vllm', '[{"text":"Kwon et al. (2023) - vLLM Paper","url":"https://arxiv.org/abs/2309.06180"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Hugging Face', 'Hugging Face Inc.', 'Platform', 'MLOps', 'Apache-2.0 (libraries)', 2016, '1M+ models hosted', 'Open platform for sharing and collaborating on ML models, datasets, and applications.', 'Cloud platform with transformers library, model hub, and deployment tools.', 'from transformers import pipeline
classifier = pipeline("sentiment-analysis")
result = classifier("I love this encyclopedia!")', 'Most popular model hub globally', 'Free tier has rate limits, deploying large models requires paid endpoints.', 'https://huggingface.co', '[{"text":"Hugging Face Documentation","url":"https://huggingface.co/docs"},{"text":"Transformers Library","url":"https://github.com/huggingface/transformers"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Perplexity AI', 'Perplexity', 'Platform', 'NLP', 'Proprietary', 2022, 'Various (Uses GPT-4, Claude 3, Sonar)', 'An AI-powered search engine that uses LLMs to search the web in real-time, providing conversational answers with direct in-line citations.', 'RAG (Retrieval-Augmented Generation) pipeline sitting on top of various frontier LLMs.', 'from openai import OpenAI
# Perplexity offers an API compatible with OpenAI''s SDK
client = OpenAI(api_key="PPLX_API_KEY", base_url="https://api.perplexity.ai")
response = client.chat.completions.create(
  model="llama-3-sonar-large-32k-online",
  messages=[{"role": "user", "content": "What is the news today?"}]
)', 'N/A', 'Quality depends heavily on the retrieved search results, occasionally hallucinates sources.', 'https://www.perplexity.ai/', '[{"text":"Perplexity API Docs","url":"https://docs.perplexity.ai/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GitHub Copilot', 'GitHub (Microsoft) & OpenAI', 'Platform', 'NLP', 'Proprietary', 2021, 'Based on customized OpenAI models', 'An AI pair programmer integrated directly into code editors, offering real-time code autocomplete and chat functionality.', 'Powered by OpenAI''s Codex and newer GPT models tailored for code generation.', '// Type a comment in VS Code to trigger Copilot
// function to parse a URL and return the domain name
function getDomain(url) {
  // Copilot suggests: return new URL(url).hostname;
}', 'N/A', 'Paid subscription required, can suggest insecure code patterns.', 'https://github.com/features/copilot', '[{"text":"GitHub Copilot Features","url":"https://github.com/features/copilot"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('OpenAI Platform', 'OpenAI', 'Platform', 'MLOps', 'Proprietary', 2020, 'N/A', 'OpenAI''s developer API platform providing access to GPT-4, DALL-E, Whisper, embeddings, and fine-tuning capabilities.', 'REST API with model routing, rate limiting, and usage tracking.', 'from openai import OpenAI
client = OpenAI(api_key="YOUR_API_KEY")
response = client.chat.completions.create(
  model="gpt-4o",
  messages=[{"role": "user", "content": "Hello!"}]
)', 'N/A', 'Pay-per-token pricing, rate limits on free tier, proprietary.', 'https://platform.openai.com', '[{"text":"OpenAI API Documentation","url":"https://platform.openai.com/docs"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Vertex AI', 'Google Cloud', 'Platform', 'MLOps', 'Proprietary', 2021, 'N/A', 'Google Cloud''s unified ML platform for building, deploying, and scaling AI models including access to Gemini, PaLM, and custom model training.', 'Managed cloud ML platform with AutoML, custom training, feature store, and model registry.', 'import vertexai
from vertexai.generative_models import GenerativeModel
vertexai.init(project="YOUR_PROJECT", location="us-central1")
model = GenerativeModel("gemini-1.5-pro")
response = model.generate_content("Describe the water cycle.")', 'N/A', 'GCP-locked, complex pricing, requires GCP account setup.', 'https://cloud.google.com/vertex-ai', '[{"text":"Vertex AI Documentation","url":"https://cloud.google.com/vertex-ai/docs"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('AWS Bedrock', 'Amazon Web Services', 'Platform', 'MLOps', 'Proprietary', 2023, 'N/A', 'Amazon''s fully managed service for accessing foundation models from Anthropic, Meta, Mistral, and others via a single API with enterprise security.', 'Managed API gateway for foundation models with AWS IAM, VPC, and CloudWatch integration.', 'import boto3, json
bedrock = boto3.client(''bedrock-runtime'', region_name=''us-east-1'')
body = json.dumps({"prompt": "\n\nHuman: Hi\n\nAssistant:", "max_tokens_to_sample": 300})
response = bedrock.invoke_model(body=body, modelId=''anthropic.claude-v2'')', 'N/A', 'AWS-locked, additional latency vs. direct API, complex IAM setup.', 'https://aws.amazon.com/bedrock/', '[{"text":"AWS Bedrock Documentation","url":"https://docs.aws.amazon.com/bedrock/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Weights & Biases', 'Weights & Biases Inc.', 'Platform', 'MLOps', 'Proprietary (free for individuals)', 2018, 'N/A', 'The ML experiment tracking and model management platform used by researchers worldwide to log metrics, visualize training, and collaborate on models.', 'Cloud-based experiment tracking with SDK integrations for PyTorch, TensorFlow, JAX, and more.', 'import wandb
wandb.init(project="my-project")
for epoch in range(10):
  loss = train_one_epoch()
  wandb.log({"loss": loss, "epoch": epoch})', 'N/A', 'Data sent to cloud servers (privacy concern), storage limits on free tier.', 'https://wandb.ai', '[{"text":"W&B Documentation","url":"https://docs.wandb.ai/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Replicate', 'Replicate Inc.', 'Platform', 'MLOps', 'Proprietary', 2019, 'N/A', 'A cloud platform for running machine learning models via API, making it easy to deploy open-source models like Llama, Stable Diffusion, and Whisper at scale.', 'Containerized model deployment with Cog packaging and pay-per-prediction pricing.', 'import replicate
output = replicate.run(
  "meta/meta-llama-3-70b-instruct",
  input={"prompt": "Write a haiku about AI"}
)
print("".join(output))', 'N/A', 'Pay-per-second pricing can be costly for heavy use, cold start latency.', 'https://replicate.com', '[{"text":"Replicate Documentation","url":"https://replicate.com/docs"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Together AI', 'Together AI', 'Platform', 'MLOps', 'Proprietary', 2022, 'N/A', 'A cloud platform for fast inference on open-source AI models with competitive pricing, offering fine-tuning and custom deployment.', 'Distributed inference cluster with FlashAttention and custom serving optimizations.', 'from together import Together
client = Together(api_key="YOUR_API_KEY")
response = client.chat.completions.create(
  model="meta-llama/Llama-3-70b-chat-hf",
  messages=[{"role": "user", "content": "What is RAG?"}]
)', 'N/A', 'Proprietary, model availability may change.', 'https://www.together.ai/', '[{"text":"Together AI Documentation","url":"https://docs.together.ai/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Groq', 'Groq Inc.', 'Platform', 'MLOps', 'Proprietary', 2016, 'N/A', 'An AI inference platform powered by custom LPU (Language Processing Unit) chips, delivering extremely fast token generation for open-source models.', 'LPU hardware with SRAM-based compute delivering deterministic, ultra-low-latency inference.', 'from groq import Groq
client = Groq(api_key="YOUR_API_KEY")
completion = client.chat.completions.create(
  model="llama3-70b-8192",
  messages=[{"role": "user", "content": "Explain transformers quickly."}]
)', '500+ tokens/second — among fastest public LLM inference APIs', 'Limited model selection, proprietary hardware dependency.', 'https://groq.com/', '[{"text":"Groq Documentation","url":"https://console.groq.com/docs/openai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Cursor', 'Anysphere', 'Platform', 'NLP', 'Proprietary', 2023, 'Based on GPT-4, Claude 3.5, and custom models', 'An AI-first code editor (fork of VS Code) with deep model integration, supporting multi-file edits, codebase chat, and agent-based refactoring.', 'VS Code fork with custom LSP-integrated AI context window and multi-model routing.', '# Cursor is a desktop application
# Use Cmd+K for inline edits
# Use Cmd+L to open chat with full codebase context
# Agent mode: Cmd+Shift+I for autonomous multi-file changes', 'N/A — fastest growing AI code editor in 2024', 'Subscription required for full model access, privacy concerns with code uploads.', 'https://cursor.com/', '[{"text":"Cursor Official Site","url":"https://cursor.com/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Midjourney (Platform)', 'Midjourney, Inc.', 'Platform', 'Computer Vision', 'Proprietary', 2022, 'N/A', 'The leading AI image generation platform accessed via Discord and a web interface, powering the most widely used consumer AI art tool.', 'Proprietary diffusion model served via Discord bot and web UI.', '# Access via Discord or https://www.midjourney.com/
/imagine prompt: Photograph of a cat wearing a spacesuit on the moon, cinematic lighting --v 6.1 --ar 16:9', 'N/A — subjective quality, widely regarded as leader for artistic output', 'No official API, paid subscription, all generations are public on free tier.', 'https://www.midjourney.com/', '[{"text":"Midjourney Website","url":"https://www.midjourney.com/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Pinecone', 'Pinecone Systems', 'Platform', 'MLOps', 'Proprietary', 2019, 'N/A', 'A managed vector database purpose-built for AI applications, enabling fast similarity search at scale for RAG, semantic search, and recommendation systems.', 'Managed ANNS (Approximate Nearest Neighbor Search) vector store with hybrid search support.', 'from pinecone import Pinecone, ServerlessSpec
pc = Pinecone(api_key="YOUR_API_KEY")
pc.create_index("my-index", dimension=1536, metric="cosine", spec=ServerlessSpec(cloud=''aws'', region=''us-east-1''))
index = pc.Index("my-index")
index.upsert(vectors=[("vec1", [0.1, 0.2], {"text": "hello"})])', 'Sub-10ms query latency at billion-vector scale', 'Proprietary, can be expensive at scale vs. self-hosted alternatives.', 'https://www.pinecone.io/', '[{"text":"Pinecone Documentation","url":"https://docs.pinecone.io/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ImageNet', 'Stanford / Princeton', 'Dataset', 'Computer Vision', 'Various (academic use)', 2009, '14M images, 150GB', 'Large-scale image dataset with 14M+ images across 20K+ categories.', 'Hierarchical organization based on WordNet, 1000 classes for ILSVRC.', 'from torchvision.datasets import ImageNet
dataset = ImageNet(root=''./data'', split=''train'')', 'Standard benchmark for computer vision (ImageNet-1K)', 'Some labeling issues, Western-centric bias.', 'https://image-net.org', '[{"text":"Deng et al. (2009) - ImageNet Paper","url":"https://ieeexplore.ieee.org/document/5206848"},{"text":"Official ImageNet Website","url":"https://image-net.org"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Common Crawl', 'Common Crawl Foundation', 'Dataset', 'NLP', 'Public Domain (Terms of Use apply)', 2008, '3+ billion web pages, ~1PB compressed', 'A massive open repository of web crawl data containing petabytes of raw text used as the primary pre-training corpus for most modern LLMs.', 'WARC/WET file format of crawled web content across decades.', '# Access via AWS S3 public dataset
import boto3
s3 = boto3.client(''s3'', region_name=''us-east-1'')
# Browse at s3://commoncrawl/
response = s3.list_objects_v2(Bucket=''commoncrawl'', Prefix=''crawl-data/CC-MAIN-2024-10/'')', 'Used to train GPT-3, LLaMA, Falcon, and virtually all frontier models', 'Requires extensive filtering (toxic content, duplicates, low quality) before use.', 'https://commoncrawl.org/', '[{"text":"Common Crawl Official Site","url":"https://commoncrawl.org/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('The Pile', 'EleutherAI', 'Dataset', 'NLP', 'MIT', 2020, '825GB, ~300B tokens', 'EleutherAI''s 825GB open-source diverse text dataset designed for training large language models, combining 22 high-quality data sources.', '22 data sources including Books3, GitHub, Wikipedia, PubMed, arXiv, and more.', '# Available on HuggingFace
from datasets import load_dataset
dataset = load_dataset("EleutherAI/pile", split="train", streaming=True)', 'Used to train GPT-NeoX, GPT-J, and other EleutherAI models', 'Some components have license restrictions (Books3 removed after legal challenges).', 'https://pile.eleuther.ai/', '[{"text":"Gao et al. (2020) - The Pile Paper","url":"https://arxiv.org/abs/2101.00027"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('LAION-5B', 'LAION', 'Dataset', 'Computer Vision', 'CC BY 4.0', 2022, '5.85B image-text pairs (~240TB)', 'A massive open-source dataset of 5.85 billion CLIP-filtered image-text pairs scraped from the web, used to train Stable Diffusion and other vision models.', 'CLIP-filtered pairs from Common Crawl with aesthetic, safety, and watermark scores.', '# Access subsets via HuggingFace
from datasets import load_dataset
dataset = load_dataset("laion/laion2B-en", split="train", streaming=True)', 'Enables training of SOTA text-to-image models', 'Contains harmful/copyrighted content, filtered versions recommended.', 'https://laion.ai/blog/laion-5b/', '[{"text":"Schuhmann et al. (2022) - LAION-5B Paper","url":"https://arxiv.org/abs/2210.08402"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('MS COCO', 'Microsoft', 'Dataset', 'Computer Vision', 'CC BY 4.0', 2014, '328K images, ~25GB', 'Microsoft''s benchmark dataset for object detection, segmentation, and captioning with 328K images containing 2.5M labeled object instances.', 'Images with bounding boxes, segmentation masks, keypoints, and 5 captions each.', 'from torchvision.datasets import CocoDetection
dataset = CocoDetection(
  root="./data/coco/images/train2017",
  annFile="./data/coco/annotations/instances_train2017.json"
)', 'Standard detection benchmark: mAP metric widely used in CV research', 'Object categories limited to 80, some class imbalance.', 'https://cocodataset.org/', '[{"text":"Lin et al. (2014) - COCO Paper","url":"https://arxiv.org/abs/1405.0312"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('OpenWebText', 'EleutherAI / Community', 'Dataset', 'NLP', 'CC0 1.0', 2019, '38GB (~8M documents)', 'An open-source recreation of OpenAI''s WebText dataset (used to train GPT-2), scraped from Reddit-upvoted URLs.', 'Web text from all outbound Reddit links with 3+ upvotes, scraped and deduplicated.', 'from datasets import load_dataset
dataset = load_dataset("openwebtext", split="train")', 'Used as training data for GPT-2 replications', 'English-only, Reddit bias toward certain demographics and topics.', 'https://huggingface.co/datasets/openwebtext', '[{"text":"OpenWebText on HuggingFace","url":"https://huggingface.co/datasets/openwebtext"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('SQuAD 2.0', 'Stanford NLP', 'Dataset', 'NLP', 'CC BY-SA 4.0', 2018, '150K questions', 'Stanford Question Answering Dataset with 100K+ questions on Wikipedia passages, including unanswerable questions to test model abstention.', 'Crowdsourced QA pairs from Wikipedia, with adversarially added unanswerable questions.', 'from datasets import load_dataset
dataset = load_dataset("squad_v2")
train_data = dataset[''train'']', 'Standard reading comprehension benchmark; human baseline F1: 89.45%', 'English-only, Wikipedia domain, extractive QA only.', 'https://rajpurkar.github.io/SQuAD-explorer/', '[{"text":"Rajpurkar et al. (2018) - SQuAD 2.0 Paper","url":"https://arxiv.org/abs/1806.03822"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('MMLU', 'UC Berkeley', 'Dataset', 'NLP', 'MIT', 2020, '15,908 questions across 57 subjects', 'Massive Multitask Language Understanding — a benchmark covering 57 subjects from STEM to humanities, used to evaluate the knowledge and reasoning of LLMs.', 'Four-choice multiple-choice questions at varying difficulty levels from elementary to professional.', 'from datasets import load_dataset
dataset = load_dataset("cais/mmlu", "all")
print(dataset[''test''][0])', 'Human expert baseline: ~89.8%. GPT-4: 86.4%, Claude 3 Opus: 86.8%', 'Multiple-choice format doesn''t capture open-ended generation ability.', 'https://github.com/hendrycks/test', '[{"text":"Hendrycks et al. (2020) - MMLU Paper","url":"https://arxiv.org/abs/2009.03300"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('HumanEval', 'OpenAI', 'Dataset', 'NLP', 'MIT', 2021, '164 hand-written programming problems', 'OpenAI''s benchmark of 164 hand-crafted Python programming problems to evaluate the code generation capability of language models.', 'Python functions with docstrings and unit tests; evaluated by pass@k metric.', 'from datasets import load_dataset
dataset = load_dataset("openai_humaneval")
print(dataset[''test''][0][''prompt''])', 'GPT-4: 67%, Claude 3.5 Sonnet: 92%, Llama 3 70B: 81.7%', 'Python-only, relatively small size, may be contaminated in model training data.', 'https://github.com/openai/human-eval', '[{"text":"Chen et al. (2021) - Evaluating LLMs Trained on Code","url":"https://arxiv.org/abs/2107.03374"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GSM8K', 'OpenAI', 'Dataset', 'NLP', 'MIT', 2021, '8,500 problems (7,500 train / 1,319 test)', 'A dataset of 8,500 high-quality grade-school math word problems requiring multi-step reasoning, used to evaluate arithmetic reasoning in LLMs.', 'Multi-step word problems with natural language solutions and final numerical answers.', 'from datasets import load_dataset
dataset = load_dataset("gsm8k", "main")
print(dataset[''test''][0])', 'GPT-4: 92%, Claude 3 Opus: 95.0%, Llama 3 70B: 93%', 'Grade-school level only, top models now saturate this benchmark.', 'https://github.com/openai/grade-school-math', '[{"text":"Cobbe et al. (2021) - GSM8K Paper","url":"https://arxiv.org/abs/2110.14168"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('RedPajama-Data-v2', 'Together AI', 'Dataset', 'NLP', 'Apache-2.0', 2023, '30T tokens (with quality signals)', 'Together AI''s massive open dataset of 30 trillion tokens with quality annotations, designed as a fully open alternative to proprietary LLM pre-training data.', 'Multi-language web data with 40+ quality annotation signals for filtering.', 'from datasets import load_dataset
dataset = load_dataset("togethercomputer/RedPajama-Data-V2", name="sample-10B", split="train", streaming=True)', 'Enables competitive open LLM training at scale', 'Requires careful filtering, quality signals are heuristic-based.', 'https://github.com/togethercomputer/RedPajama-Data', '[{"text":"RedPajama-V2 Paper","url":"https://arxiv.org/abs/2402.06935"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Alpaca Dataset', 'Stanford CRFM', 'Dataset', 'NLP', 'CC BY NC 4.0', 2023, '52,002 instruction-following pairs', 'Stanford''s 52K instruction-following examples generated by GPT-3.5, kickstarting the open-source instruction tuning movement.', 'Self-Instruct format: instruction, input (optional), and output triples.', 'from datasets import load_dataset
dataset = load_dataset("tatsu-lab/alpaca")
print(dataset[''train''][0])', 'Fine-tuning LLaMA 7B on this data produces near-ChatGPT quality', 'Non-commercial license, GPT-3.5 generated (potential errors), English-only.', 'https://github.com/tatsu-lab/stanford_alpaca', '[{"text":"Alpaca Dataset Release","url":"https://crfm.stanford.edu/2023/03/13/alpaca.html"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ChatGPT', 'OpenAI', 'AI', 'NLP', 'Proprietary', 2022, 'N/A', 'An advanced AI assistant by OpenAI, utilizing the GPT-4 family of models to converse, write code, and assist with a wide range of tasks.', 'Web Application / Conversational Agent (Powered by GPT-4/GPT-4o)', 'Visit chatgpt.com to interact via the web interface.', 'N/A (See underlying models like GPT-4o)', 'May hallucinate, knowledge cutoff depends on the model version.', 'https://chatgpt.com', '[{"text":"ChatGPT Announcement","url":"https://openai.com/blog/chatgpt"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Claude', 'Anthropic', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Anthropic''s AI assistant, known for its high capabilities in coding, writing, and logical reasoning, and featuring a large context window.', 'Web Application / Conversational Agent (Powered by Claude 3/3.5 Family)', 'Visit claude.ai to interact via the web interface.', 'N/A (See underlying models like Claude 3.5 Sonnet)', 'May refuse prompts due to strict safety filters.', 'https://claude.ai', '[{"text":"Claude Announcement","url":"https://www.anthropic.com/claude"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Perplexity', 'Perplexity AI', 'AI', 'NLP', 'Proprietary', 2022, 'N/A', 'An AI-powered search engine that provides cited answers by searching the web in real-time, functioning as an intelligent research assistant.', 'Answer Engine / Conversational Agent (Powered by various LLMs and search indices)', 'Visit perplexity.ai to search and interact.', 'N/A', 'Sometimes cites incorrect sources or misunderstands query intent.', 'https://www.perplexity.ai', '[{"text":"Perplexity AI","url":"https://www.perplexity.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('DeepSeek Chat', 'DeepSeek AI', 'AI', 'NLP', 'Proprietary / DeepSeek License', 2023, 'N/A', 'An intelligent AI assistant by DeepSeek, highly capable in coding, math, and logical reasoning, powered by efficient open-weight models.', 'Web Application / Conversational Agent (Powered by DeepSeek-V2 / DeepSeek Coder)', 'Visit chat.deepseek.com to interact.', 'N/A', 'May struggle with some niche topics compared to ChatGPT or Claude.', 'https://chat.deepseek.com', '[{"text":"DeepSeek Chat","url":"https://chat.deepseek.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Google Gemini', 'Google DeepMind', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Google''s flagship AI assistant (formerly Bard), featuring multimodal capabilities and tight integration with Google Workspace.', 'Web Application / Conversational Agent (Powered by Gemini Pro / Ultra models)', 'Visit gemini.google.com to interact.', 'N/A', 'May hallucinate, some features are restricted by region.', 'https://gemini.google.com', '[{"text":"Gemini Announcement","url":"https://blog.google/technology/ai/google-gemini-ai/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Microsoft Copilot', 'Microsoft', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Microsoft''s AI assistant (formerly Bing Chat), integrated with Windows and Microsoft 365, combining GPT-4 with real-time web search.', 'Web Application / OS Integration (Powered by GPT-4 and Bing Search)', 'Visit copilot.microsoft.com or use it directly in Windows 11 / Edge.', 'N/A', 'Can be slow during peak times, responses are sometimes limited in length.', 'https://copilot.microsoft.com', '[{"text":"Copilot Announcement","url":"https://blogs.microsoft.com/blog/2023/09/21/announcing-microsoft-copilot-your-everyday-ai-companion/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Grok', 'xAI', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'An AI assistant developed by xAI, designed to have a bit of wit, a rebellious streak, and real-time access to X (Twitter) data.', 'Web Application / Conversational Agent (Powered by Grok models)', 'Access via X Premium subscription.', 'N/A', 'Requires an active X Premium subscription.', 'https://x.ai', '[{"text":"Grok Announcement","url":"https://x.ai/blog/grok"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Meta AI', 'Meta', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Meta''s smart assistant integrated into WhatsApp, Instagram, Facebook, and Messenger, capable of answering questions and generating images.', 'Chatbot Integration (Powered by Llama 3 models)', 'Use it directly inside Meta''s messaging apps or at meta.ai.', 'N/A', 'Feature availability varies by country and platform.', 'https://www.meta.ai', '[{"text":"Meta AI Announcement","url":"https://about.fb.com/news/2023/09/introducing-ai-experiences-across-our-family-of-apps-and-devices/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('HuggingChat', 'Hugging Face', 'AI', 'NLP', 'Open Source UI / Various model licenses', 2023, 'N/A', 'An open-source AI assistant by Hugging Face, allowing users to converse with various top-tier open-weight models.', 'Web Application (Supports Llama, Mistral, Command R, etc.)', 'Visit huggingface.co/chat to interact.', 'N/A', 'Model availability may rotate, performance depends on the selected underlying model.', 'https://huggingface.co/chat', '[{"text":"HuggingChat","url":"https://huggingface.co/chat"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('GitHub Copilot', 'GitHub', 'AI', 'NLP', 'Proprietary', 2021, 'N/A', 'An AI pair programmer that offers autocomplete-style suggestions as you code, integrated directly into your IDE.', 'IDE Extension / Service (Powered by OpenAI models)', 'Install the GitHub Copilot extension in VS Code or JetBrains IDEs.', 'N/A', 'Paid subscription required, may suggest incorrect or insecure code.', 'https://github.com/features/copilot', '[{"text":"GitHub Copilot","url":"https://github.com/features/copilot"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Character.ai', 'Character Technologies', 'AI', 'NLP', 'Proprietary', 2022, 'N/A', 'A neural language model chatbot web application that can generate human-like text responses and participate in contextual conversation, often used for roleplay.', 'Web Application / Chatbot (Custom LLMs)', 'Visit character.ai to chat with community-created characters.', 'N/A', 'Highly filtered, mainly focused on entertainment rather than factual accuracy.', 'https://character.ai', '[{"text":"Character.ai","url":"https://character.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Pi', 'Inflection AI', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'A supportive and empathetic conversational AI assistant designed to be a companion rather than just a tool.', 'Web Application / Conversational Agent (Powered by Inflection models)', 'Visit pi.ai to interact.', 'N/A', 'Prioritizes conversational style over complex reasoning or coding tasks.', 'https://pi.ai', '[{"text":"Meet Pi","url":"https://inflection.ai/press/meet-pi"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Mistral Le Chat', 'Mistral AI', 'AI', 'NLP', 'Proprietary', 2024, 'N/A', 'A fast and capable conversational AI assistant by Mistral AI, built on their own open-weight models with a focus on efficiency.', 'Web Application / Conversational Agent (Powered by Mistral Large / Mistral Small)', 'Visit chat.mistral.ai to interact via the web interface.', 'N/A', 'Smaller ecosystem compared to OpenAI or Google; some advanced features require a paid plan.', 'https://chat.mistral.ai', '[{"text":"Mistral Le Chat","url":"https://chat.mistral.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Poe', 'Quora', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'A platform by Quora that provides access to multiple AI chatbots including GPT-4, Claude, Gemini, and community-created bots in one unified interface.', 'Web Application / Multi-Model Platform (Aggregates GPT-4, Claude, Gemini, Llama, etc.)', 'Visit poe.com or download the Poe app to access multiple AI models.', 'N/A', 'Daily message limits on free tier; quality depends on the chosen underlying model.', 'https://poe.com', '[{"text":"Poe by Quora","url":"https://poe.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('You.com', 'You.com', 'AI', 'NLP', 'Proprietary', 2022, 'N/A', 'An AI-powered search and chat assistant that combines real-time web search with conversational AI, offering modes for research, coding, and writing.', 'Answer Engine / Conversational Agent (Powered by multiple LLMs and web indices)', 'Visit you.com to search and interact with the AI assistant.', 'N/A', 'Quality varies depending on the selected AI mode; some features are behind a paywall.', 'https://you.com', '[{"text":"You.com","url":"https://you.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Cohere Coral', 'Cohere', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'An enterprise-focused conversational AI assistant by Cohere, designed for business use cases like search, summarization, and knowledge retrieval.', 'Web Application / Conversational Agent (Powered by Command R+ models)', 'Visit coral.cohere.com to interact via the web interface.', 'N/A', 'Primarily optimized for enterprise workflows; less suited for casual general-purpose use.', 'https://coral.cohere.com', '[{"text":"Cohere Coral","url":"https://coral.cohere.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ERNIE Bot', 'Baidu', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Baidu''s conversational AI assistant powered by the ERNIE large language model, strong in Chinese language tasks and integrated with Baidu Search.', 'Web Application / Conversational Agent (Powered by ERNIE 4.0)', 'Visit yiyan.baidu.com to interact; primarily available in China.', 'N/A', 'Primarily optimized for Chinese language; access outside China may be restricted.', 'https://yiyan.baidu.com', '[{"text":"ERNIE Bot","url":"https://yiyan.baidu.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('HyperCLOVA X', 'Naver', 'AI', 'NLP', 'Proprietary', 2023, 'N/A', 'Naver''s large-scale Korean-English bilingual AI assistant, fine-tuned for Korean cultural context and integrated into Naver''s search and services.', 'Web Application / Conversational Agent (Powered by HyperCLOVA X model)', 'Access via clova.ai or integrated directly into Naver Search and other Naver services.', 'N/A', 'Primarily focused on Korean and English; limited global availability.', 'https://clova.ai', '[{"text":"HyperCLOVA X","url":"https://clova.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Cursor', 'Anysphere', 'AI', 'AI Coding', 'Proprietary', 2023, 'N/A', 'An AI-first code editor forked from VS Code, deeply integrating LLMs for inline code generation, multi-file edits, and natural language codebase chat.', 'IDE Application (VS Code fork integrating GPT-4, Claude, and custom models)', 'Download and install from cursor.com; works as a drop-in VS Code replacement.', 'N/A', 'Paid subscription for full AI features; privacy concerns around sending code to external APIs.', 'https://cursor.com', '[{"text":"Cursor","url":"https://cursor.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Tabnine', 'Tabnine', 'AI', 'AI Coding', 'Proprietary', 2019, 'N/A', 'An AI code completion assistant that integrates with most IDEs and supports local or cloud-based models, offering a privacy-conscious alternative to cloud-only tools.', 'IDE Plugin (Supports local models + cloud models; integrates with VS Code, JetBrains, Neovim, etc.)', 'Install the Tabnine extension from your IDE''s marketplace (VS Code, JetBrains, Neovim, etc.).', 'N/A', 'Free tier has limited completions; local model mode requires a capable machine.', 'https://www.tabnine.com', '[{"text":"Tabnine","url":"https://www.tabnine.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Replit Ghostwriter', 'Replit', 'AI', 'AI Coding', 'Proprietary', 2022, 'N/A', 'An AI coding assistant built into the Replit online IDE, offering code completion, explanation, transformation, and a conversational chat interface for debugging.', 'Web IDE Integration (Powered by custom models and third-party LLMs)', 'Access at replit.com; Ghostwriter is available in the editor with a Replit Core subscription.', 'N/A', 'Requires a paid Replit Core plan; primarily designed for use within the Replit environment.', 'https://replit.com/ai', '[{"text":"Replit Ghostwriter","url":"https://replit.com/ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Amazon CodeWhisperer', 'Amazon Web Services', 'AI', 'AI Coding', 'Proprietary', 2022, 'N/A', 'Amazon''s AI code generator integrated into popular IDEs, trained on billions of lines of code and AWS APIs, with built-in security vulnerability scanning.', 'IDE Extension (Integrates with VS Code, JetBrains, AWS Cloud9, and more)', 'Install the AWS Toolkit extension in VS Code or JetBrains and sign in with an AWS Builder ID.', 'N/A', 'Best suited for AWS-related codebases; individual tier is free but team features are paid.', 'https://aws.amazon.com/codewhisperer', '[{"text":"Amazon CodeWhisperer","url":"https://aws.amazon.com/codewhisperer"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Windsurf', 'Codeium', 'AI', 'AI Coding', 'Proprietary', 2024, 'N/A', 'An AI-powered code editor by Codeium featuring ''Flows'' — a deeply agentic coding experience where AI and developer collaborate on the same codebase simultaneously.', 'IDE Application (VS Code fork with proprietary Codeium AI and agentic flow engine)', 'Download from codeium.com/windsurf and install as a standalone IDE.', 'N/A', 'Newer product with a smaller community than Cursor; some agentic features are still maturing.', 'https://codeium.com/windsurf', '[{"text":"Windsurf by Codeium","url":"https://codeium.com/windsurf"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Bolt.new', 'StackBlitz', 'AI', 'AI Coding', 'Proprietary', 2024, 'N/A', 'A browser-based AI full-stack development environment by StackBlitz that lets users prompt, run, edit, and deploy complete web applications without any local setup.', 'Web Application (Powered by Claude and other LLMs with WebContainers runtime)', 'Visit bolt.new and describe the app you want to build; it generates and runs the code instantly.', 'N/A', 'Free tier has prompt/token limits; complex apps may require significant manual debugging.', 'https://bolt.new', '[{"text":"Bolt.new","url":"https://bolt.new"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Midjourney', 'Midjourney Inc.', 'AI', 'Image Generation', 'Proprietary', 2022, 'N/A', 'An AI image generation service known for producing highly artistic and aesthetically striking images from text prompts, operated via Discord.', 'Web Application / Discord Bot (Proprietary diffusion model)', 'Join the Midjourney Discord server at discord.gg/midjourney and use /imagine commands.', 'N/A', 'Requires a paid subscription; primarily Discord-based; limited control over prompt precision.', 'https://www.midjourney.com', '[{"text":"Midjourney","url":"https://www.midjourney.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Adobe Firefly', 'Adobe', 'AI', 'Image Generation', 'Proprietary', 2023, 'N/A', 'Adobe''s generative AI tool for image creation and editing, integrated into Photoshop and other Creative Cloud apps, trained exclusively on licensed content.', 'Web Application / Creative Suite Integration (Proprietary diffusion model)', 'Visit firefly.adobe.com or use Generative Fill directly inside Adobe Photoshop.', 'N/A', 'Requires an Adobe account; best features need a Creative Cloud subscription.', 'https://firefly.adobe.com', '[{"text":"Adobe Firefly","url":"https://firefly.adobe.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Leonardo.ai', 'Leonardo.ai', 'AI', 'Image Generation', 'Proprietary', 2022, 'N/A', 'A versatile AI image generation platform popular with game developers and artists, offering fine-tuned models, canvas editing, and consistent character generation.', 'Web Application (Powered by Stable Diffusion fine-tunes and proprietary models)', 'Visit leonardo.ai, create an account, and generate images using built-in or custom models.', 'N/A', 'Daily token limit on the free plan; advanced features like real-time canvas require paid credits.', 'https://leonardo.ai', '[{"text":"Leonardo.ai","url":"https://leonardo.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Ideogram', 'Ideogram AI', 'AI', 'Image Generation', 'Proprietary', 2023, 'N/A', 'An AI image generation tool that excels at rendering accurate, legible text within images — a long-standing weakness of most diffusion models.', 'Web Application (Proprietary text-aware image generation model)', 'Visit ideogram.ai, sign in, and generate images with text prompts including typographic elements.', 'N/A', 'Free tier limits daily generations; less photorealistic than Midjourney for non-text images.', 'https://ideogram.ai', '[{"text":"Ideogram AI","url":"https://ideogram.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Playground AI', 'Playground AI', 'AI', 'Image Generation', 'Proprietary', 2022, 'N/A', 'A free-to-use online AI image generation platform offering a generous free tier and a canvas editor for creating and mixing images with various model styles.', 'Web Application (Powered by Stable Diffusion variants and proprietary Playground v2 model)', 'Visit playground.com to generate images for free with up to 500 images/day on the free tier.', 'N/A', 'Heavy users need a paid plan; commercial use of generated images requires a paid subscription.', 'https://playground.com', '[{"text":"Playground AI","url":"https://playground.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('NightCafe', 'NightCafe Studio', 'AI', 'Image Generation', 'Proprietary', 2019, 'N/A', 'An AI art generator and social community platform with multiple generation algorithms, daily free credits, and art challenges for creators.', 'Web Application (Supports Stable Diffusion, DALL·E, and other generation backends)', 'Visit creator.nightcafe.studio to generate images and participate in the community.', 'N/A', 'Limited free credits; best results often require purchased credit packs.', 'https://creator.nightcafe.studio', '[{"text":"NightCafe Creator","url":"https://creator.nightcafe.studio"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Runway', 'Runway', 'AI', 'Video Generation', 'Proprietary', 2022, 'N/A', 'An AI-powered creative platform for generating and editing videos from text or image prompts, widely used in professional film and content production.', 'Web Application (Proprietary video diffusion model — Gen-2 / Gen-3 Alpha)', 'Access via app.runwayml.com; generate videos from text or image prompts through the web interface.', 'N/A', 'Expensive credits system; generation length is capped; occasional temporal inconsistencies.', 'https://runwayml.com', '[{"text":"Runway Gen-3 Alpha","url":"https://runwayml.com/research/gen-3-alpha"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Pika Labs', 'Pika Labs', 'AI', 'Video Generation', 'Proprietary', 2023, 'N/A', 'An AI video generation and editing tool that can create and modify short video clips from text or image prompts, known for fun and accessible creative outputs.', 'Web Application / Discord Bot (Proprietary video generation model — Pika 1.0/2.0)', 'Visit pika.art to generate and edit videos from text or image prompts.', 'N/A', 'Short maximum clip duration; free tier has watermarks and limited generation credits.', 'https://pika.art', '[{"text":"Pika Labs","url":"https://pika.art"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Kling AI', 'Kuaishou', 'AI', 'Video Generation', 'Proprietary', 2024, 'N/A', 'A powerful AI video generation model by Kuaishou capable of producing realistic 2-minute videos at 1080p from text or image inputs.', 'Web Application (Proprietary video diffusion model with 3D spatiotemporal attention)', 'Access via klingai.com; generate videos from text prompts or reference images.', 'N/A', 'Longer generation times compared to some competitors; some features require a paid plan.', 'https://klingai.com', '[{"text":"Kling AI","url":"https://klingai.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('HeyGen', 'HeyGen', 'AI', 'Video Generation', 'Proprietary', 2020, 'N/A', 'An AI video generation platform specializing in realistic AI avatar videos and video translation with lip-sync, widely used for marketing and corporate communications.', 'Web Application (Proprietary talking-head synthesis and lip-sync AI model)', 'Visit heygen.com, choose an avatar or upload your own, write a script, and generate a video.', 'N/A', 'Free tier is very limited; video translation accuracy can vary with complex audio.', 'https://www.heygen.com', '[{"text":"HeyGen","url":"https://www.heygen.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Luma Dream Machine', 'Luma AI', 'AI', 'Video Generation', 'Proprietary', 2024, 'N/A', 'Luma AI''s fast and high-quality video generation model that creates realistic, physically accurate video clips from text prompts or still images.', 'Web Application (Proprietary video diffusion model with physics-aware generation)', 'Visit lumalabs.ai/dream-machine to generate videos from text or image inputs.', 'N/A', 'Free tier has limited monthly generations; longer clips require paid credits.', 'https://lumalabs.ai/dream-machine', '[{"text":"Luma Dream Machine","url":"https://lumalabs.ai/dream-machine"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Synthesia', 'Synthesia', 'AI', 'Video Generation', 'Proprietary', 2017, 'N/A', 'An AI video generation platform that creates professional videos with realistic AI avatars speaking from a script, used widely for corporate training and marketing.', 'Web Application (Proprietary talking-head video synthesis model)', 'Visit synthesia.io, write a script, choose an AI avatar, and generate a video in minutes.', 'N/A', 'Limited avatar customization on lower-tier plans; video style can feel corporate.', 'https://www.synthesia.io', '[{"text":"Synthesia","url":"https://www.synthesia.io"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('ElevenLabs', 'ElevenLabs', 'AI', 'Audio', 'Proprietary', 2022, 'N/A', 'A leading AI voice synthesis platform capable of cloning voices and generating ultra-realistic speech in multiple languages from text.', 'Web Application / API (Proprietary TTS and voice cloning models)', 'Visit elevenlabs.io to generate speech or use the ElevenLabs API for programmatic access.', 'N/A', 'Free tier has limited monthly character quota; voice cloning requires audio samples.', 'https://elevenlabs.io', '[{"text":"ElevenLabs","url":"https://elevenlabs.io"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Murf AI', 'Murf Inc.', 'AI', 'Audio', 'Proprietary', 2020, 'N/A', 'An AI voice generator and text-to-speech studio offering 120+ realistic voices in 20+ languages, with a built-in editor for voiceovers and presentations.', 'Web Application (Proprietary neural TTS model with studio-grade audio processing)', 'Visit murf.ai to type or paste text, choose a voice, and generate and download audio.', 'N/A', 'Free tier has a 10-minute voice generation limit; downloads require a paid plan.', 'https://murf.ai', '[{"text":"Murf AI","url":"https://murf.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Descript', 'Descript', 'AI', 'Audio', 'Proprietary', 2017, 'N/A', 'An AI-powered audio and video editing tool that lets users edit media by editing the transcript, with features like voice cloning, filler word removal, and overdub.', 'Desktop / Web Application (Proprietary ASR + TTS + video editing pipeline)', 'Download Descript from descript.com; import audio or video and edit by modifying the transcript.', 'N/A', 'Overdub voice cloning requires recording samples; some AI features are in paid tiers only.', 'https://www.descript.com', '[{"text":"Descript","url":"https://www.descript.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Adobe Podcast', 'Adobe', 'AI', 'Audio', 'Proprietary', 2022, 'N/A', 'Adobe''s AI audio enhancement tool that automatically removes background noise and enhances microphone quality to make any recording sound studio-recorded.', 'Web Application (Proprietary AI speech enhancement model — Project Shasta)', 'Visit podcast.adobe.com, upload an audio file, and use Enhance Speech to clean up the recording.', 'N/A', 'Works best on speech; music or mixed audio may degrade; requires an Adobe account.', 'https://podcast.adobe.com', '[{"text":"Adobe Podcast","url":"https://podcast.adobe.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Play.ht', 'Play.ht', 'AI', 'Audio', 'Proprietary', 2016, 'N/A', 'An AI voice generator and text-to-speech platform with 900+ ultra-realistic voices, offering voice cloning and an API for developers to embed audio in apps.', 'Web Application / API (Powered by proprietary PlayHT 2.0 and PlayDialog models)', 'Visit play.ht to generate speech from text or access the API for programmatic voice generation.', 'N/A', 'Voice cloning and API access require paid plans; free tier has limited word generation.', 'https://play.ht', '[{"text":"Play.ht","url":"https://play.ht"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Suno', 'Suno Inc.', 'AI', 'Audio', 'Proprietary', 2023, 'N/A', 'An AI music generation platform that creates full songs with vocals, instrumentation, and lyrics from a simple text prompt in seconds.', 'Web Application (Proprietary audio diffusion and language model pipeline)', 'Visit suno.com and type a prompt describing the style or lyrics to generate a full song.', 'N/A', 'Limited control over fine-grained musical elements; commercial use requires a paid plan.', 'https://suno.com', '[{"text":"Suno AI","url":"https://suno.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Udio', 'Udio', 'AI', 'Audio', 'Proprietary', 2024, 'N/A', 'An AI music creation tool that generates high-quality, diverse music tracks with vocals and instrumentation from short text descriptions.', 'Web Application (Proprietary generative audio model)', 'Visit udio.com, describe the music style or mood, and generate tracks instantly.', 'N/A', 'Free tier has monthly generation limits; less genre variety compared to Suno in some styles.', 'https://www.udio.com', '[{"text":"Udio","url":"https://www.udio.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Notion AI', 'Notion Labs', 'AI', 'Productivity', 'Proprietary', 2023, 'N/A', 'An AI writing and productivity assistant built directly into Notion, capable of drafting, summarizing, translating, and brainstorming within your workspace.', 'SaaS Integration (Powered by OpenAI GPT-4 and Anthropic Claude models)', 'Access inside any Notion workspace by pressing the spacebar or typing /AI on any page.', 'N/A', 'Requires a Notion AI add-on subscription; dependent on third-party LLM providers.', 'https://www.notion.so/product/ai', '[{"text":"Notion AI","url":"https://www.notion.so/product/ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Grammarly', 'Grammarly Inc.', 'AI', 'Productivity', 'Proprietary', 2009, 'N/A', 'An AI-powered writing assistant that checks grammar, spelling, tone, clarity, and style in real-time across browsers, documents, and email clients.', 'Browser Extension / SaaS (Proprietary NLP models + generative AI layer)', 'Install the Grammarly browser extension from grammarly.com or use the desktop app.', 'N/A', 'Premium plan required for advanced suggestions; can occasionally suggest unnatural rephrasing.', 'https://www.grammarly.com', '[{"text":"Grammarly","url":"https://www.grammarly.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Copy.ai', 'Copy.ai', 'AI', 'Productivity', 'Proprietary', 2020, 'N/A', 'An AI-powered copywriting tool that generates marketing copy, product descriptions, email sequences, social media posts, and more from short prompts.', 'Web Application (Powered by GPT-4 with marketing-specific workflows and templates)', 'Visit copy.ai, select a content type template, enter your product info, and generate copy.', 'N/A', 'Outputs often require editing; free tier limits monthly word count.', 'https://www.copy.ai', '[{"text":"Copy.ai","url":"https://www.copy.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Jasper', 'Jasper AI', 'AI', 'Productivity', 'Proprietary', 2021, 'N/A', 'An AI content writing platform designed for marketing teams, capable of generating blog posts, ad copy, social media content, and brand-consistent text at scale.', 'Web Application (Powered by GPT-4 and other LLMs with marketing-specific fine-tuning)', 'Visit jasper.ai to sign up and use the web editor for AI content generation.', 'N/A', 'Expensive subscription plans; outputs may still require human editing for accuracy.', 'https://www.jasper.ai', '[{"text":"Jasper AI","url":"https://www.jasper.ai"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Writesonic', 'Writesonic', 'AI', 'Productivity', 'Proprietary', 2020, 'N/A', 'An AI writing assistant and chatbot platform that helps generate SEO-optimized articles, landing pages, ads, and social media content at scale.', 'Web Application (Powered by GPT-4 with SEO and marketing-specific tooling)', 'Visit writesonic.com to access the editor and start generating content with templates.', 'N/A', 'Quality can vary for niche topics; word credit limits apply on most plans.', 'https://writesonic.com', '[{"text":"Writesonic","url":"https://writesonic.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Tome', 'Tome', 'AI', 'Productivity', 'Proprietary', 2020, 'N/A', 'An AI-powered storytelling and presentation tool that generates complete slide decks with text, images, and layouts from a single prompt.', 'Web Application (Powered by GPT-4 for content + DALL·E for image generation)', 'Visit tome.app, enter a prompt for your presentation topic, and Tome generates a full deck.', 'N/A', 'Limited design customization compared to traditional tools; export options are restricted.', 'https://tome.app', '[{"text":"Tome","url":"https://tome.app"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Gamma', 'Gamma Tech', 'AI', 'Productivity', 'Proprietary', 2020, 'N/A', 'An AI presentation and document builder that generates beautiful, shareable decks, webpages, and documents from text prompts or outlines in seconds.', 'Web Application (Powered by GPT-4 with proprietary layout and design generation engine)', 'Visit gamma.app, describe your content, and generate a fully designed presentation instantly.', 'N/A', 'Free tier adds a Gamma watermark; advanced themes and AI credits require a paid plan.', 'https://gamma.app', '[{"text":"Gamma","url":"https://gamma.app"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Canva AI', 'Canva', 'AI', 'Image Generation', 'Proprietary', 2023, 'N/A', 'A suite of AI-powered design tools inside Canva, including Magic Write for text generation, Magic Media for image creation, and one-click background removal.', 'Web Application (Integrates Stable Diffusion, proprietary models, and third-party LLMs)', 'Access at canva.com; AI tools are available within the design editor for all account types.', 'N/A', 'Advanced AI features require a Canva Pro subscription; image generation credits are limited.', 'https://www.canva.com/ai-image-generator', '[{"text":"Canva Magic Studio","url":"https://www.canva.com/magic-studio/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Otter.ai', 'AISense Inc.', 'AI', 'Productivity', 'Proprietary', 2016, 'N/A', 'An AI meeting assistant that automatically transcribes, summarizes, and generates action items from voice conversations and meetings in real time.', 'Web / Mobile Application (Proprietary ASR + NLP summarization pipeline)', 'Visit otter.ai or install the mobile app; connect to Zoom, Google Meet, or MS Teams for auto-join.', 'N/A', 'Free tier limited to 300 minutes/month; accuracy drops with heavy accents or noisy audio.', 'https://otter.ai', '[{"text":"Otter.ai","url":"https://otter.ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Copilot for Microsoft 365', 'Microsoft', 'AI', 'Productivity', 'Proprietary', 2023, 'N/A', 'Microsoft''s AI assistant embedded in Word, Excel, PowerPoint, Outlook, and Teams, helping users draft, summarize, and analyze within their daily M365 workflow.', 'SaaS Integration (Powered by GPT-4 with Microsoft Graph data grounding)', 'Requires a Microsoft 365 subscription with a Copilot add-on; accessible within all M365 apps.', 'N/A', 'Expensive add-on ($30/user/month); quality depends heavily on organizational data quality.', 'https://www.microsoft.com/en-us/microsoft-365/copilot', '[{"text":"Microsoft 365 Copilot","url":"https://blogs.microsoft.com/blog/2023/03/16/introducing-microsoft-365-copilot-your-copilot-for-work/"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Khanmigo', 'Khan Academy', 'AI', 'Education', 'Proprietary', 2023, 'N/A', 'An AI tutor by Khan Academy that guides students through topics using the Socratic method, asking questions rather than giving direct answers to encourage learning.', 'Web Application (Powered by GPT-4 with educational fine-tuning and guardrails)', 'Access at khanacademy.org; available to students and teachers with a Khan Academy account.', 'N/A', 'Requires a Khan Academy account; primarily focused on K-12 curriculum topics.', 'https://www.khanacademy.org/khan-labs', '[{"text":"Khanmigo by Khan Academy","url":"https://www.khanacademy.org/khan-labs"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Socratic by Google', 'Google', 'AI', 'Education', 'Proprietary', 2017, 'N/A', 'A Google AI-powered learning app that helps students understand homework questions by providing explanations, videos, and step-by-step breakdowns from a photo scan.', 'Mobile Application (Powered by Google Lens OCR + Google Search + LLM explanations)', 'Download the Socratic app on iOS or Android and take a photo of any homework question.', 'N/A', 'Works best for standard K-12 subjects; may struggle with highly specialized or advanced topics.', 'https://socratic.org', '[{"text":"Socratic by Google","url":"https://socratic.org"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Duolingo Max', 'Duolingo', 'AI', 'Education', 'Proprietary', 2023, 'N/A', 'Duolingo''s premium AI-powered tier featuring GPT-4 driven features like Explain My Answer for detailed feedback and Roleplay for open-ended AI conversation practice.', 'Mobile / Web Application (Powered by GPT-4 integrated into the Duolingo platform)', 'Upgrade to Duolingo Max within the Duolingo iOS or Android app to access AI features.', 'N/A', 'Only available for select languages; requires a paid Max subscription on top of Duolingo Plus.', 'https://blog.duolingo.com/duolingo-max', '[{"text":"Duolingo Max","url":"https://blog.duolingo.com/duolingo-max"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Quizlet AI', 'Quizlet', 'AI', 'Education', 'Proprietary', 2023, 'N/A', 'Quizlet''s AI-powered study assistant that generates practice questions, explains concepts, and personalizes study sets based on what a student is struggling with.', 'Web / Mobile Application (Powered by OpenAI GPT models with Quizlet''s study data)', 'Visit quizlet.com or open the app; Q-Chat and AI features are available on Quizlet Plus.', 'N/A', 'AI features require a Quizlet Plus subscription; AI-generated flashcards may contain errors.', 'https://quizlet.com/features/quizlet-ai', '[{"text":"Quizlet AI","url":"https://quizlet.com/features/quizlet-ai"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Elicit', 'Ought', 'AI', 'Research', 'Proprietary', 2021, 'N/A', 'An AI research assistant that searches and summarizes academic papers, extracts key data from studies, and helps researchers synthesize literature at scale.', 'Web Application (Powered by LLMs with semantic search over academic paper databases)', 'Visit elicit.com, enter a research question, and get summaries and data from relevant papers.', 'N/A', 'Coverage limited to papers indexed in Semantic Scholar; may miss very recent publications.', 'https://elicit.com', '[{"text":"Elicit","url":"https://elicit.com"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Consensus', 'Consensus', 'AI', 'Research', 'Proprietary', 2022, 'N/A', 'An AI-powered academic search engine that finds and synthesizes evidence from peer-reviewed research papers to answer scientific and factual questions.', 'Web Application (Semantic search over 200M+ academic papers with LLM synthesis layer)', 'Visit consensus.app, ask a research question, and get answers backed by peer-reviewed citations.', 'N/A', 'Limited to published academic research; GPT-4 powered summaries require a premium plan.', 'https://consensus.app', '[{"text":"Consensus","url":"https://consensus.app"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Semantic Scholar', 'Allen Institute for AI (AI2)', 'AI', 'Research', 'Free', 2015, 'N/A', 'A free AI-powered academic search engine by the Allen Institute for AI that provides smart paper recommendations, citation graphs, and TLDR summaries of research papers.', 'Web Application (Proprietary NLP models for paper summarization and semantic search)', 'Visit semanticscholar.org to search for papers and access AI-generated summaries and citations.', 'N/A', 'TLDR summaries can oversimplify findings; coverage of non-English papers is limited.', 'https://www.semanticscholar.org', '[{"text":"Semantic Scholar","url":"https://www.semanticscholar.org"}]'::jsonb, false, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

INSERT INTO entries (name, org, type, task, license, year, size, summary, architecture, usage, benchmarks, limitations, url, citations, popular, approved)
VALUES ('Replika', 'Luka Inc.', 'AI', 'NLP', 'Proprietary', 2017, 'N/A', 'An AI companion app designed for emotional support and personal conversation, allowing users to build a relationship with a customizable AI persona.', 'Mobile / Web Application (Powered by custom fine-tuned LLMs)', 'Download the Replika app on iOS or Android, or visit replika.com to chat with your AI companion.', 'N/A', 'Some features require a paid subscription; content policies changed significantly in 2023.', 'https://replika.com', '[{"text":"Replika","url":"https://replika.com"}]'::jsonb, true, true)
ON CONFLICT (name) DO UPDATE SET
  org = EXCLUDED.org,
  type = EXCLUDED.type,
  task = EXCLUDED.task,
  license = EXCLUDED.license,
  year = EXCLUDED.year,
  size = EXCLUDED.size,
  summary = EXCLUDED.summary,
  architecture = EXCLUDED.architecture,
  usage = EXCLUDED.usage,
  benchmarks = EXCLUDED.benchmarks,
  limitations = EXCLUDED.limitations,
  url = EXCLUDED.url,
  citations = EXCLUDED.citations,
  popular = EXCLUDED.popular,
  approved = true;

