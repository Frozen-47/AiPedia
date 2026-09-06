import type { Entry } from './types';

export const entries: Entry[] = [
  {
    "name": "DeepSeek-V3",
    "type": "Model",
    "summary": "DeepSeek's flagship 671B Mixture-of-Experts (MoE) model with Multi-head Latent Attention (MLA), activating 37B params per token with industry-leading efficiency.",
    "task": "NLP",
    "license": "MIT",
    "year": 2024,
    "org": "DeepSeek",
    "size": "671B (37B active)",
    "architecture": "Multi-head Latent Attention (MLA) + DeepSeekMoE + FP8 Mixed Precision Training.",
    "usage": "from openai import OpenAI\nclient = OpenAI(api_key=\"YOUR_KEY\", base_url=\"https://api.deepseek.com\")\nresponse = client.chat.completions.create(\n  model=\"deepseek-chat\",\n  messages=[{\"role\": \"user\", \"content\": \"Explain MLA architecture.\"}]\n)",
    "benchmarks": "MMLU-Redux: 89.1%, HumanEval: 90.2%, MATH-500: 75.7%",
    "limitations": "Massive parameter footprint requires multi-GPU or cloud API hosting.",
    "popular": true,
    "url": "https://www.deepseek.com",
    "citations": [
      {
        "text": "DeepSeek-V3 Technical Report",
        "url": "https://github.com/deepseek-ai/DeepSeek-V3"
      }
    ]
  },
  {
    "name": "DeepSeek-R1",
    "type": "Model",
    "summary": "Breakthrough open-weights reasoning model trained via large-scale reinforcement learning (RL) without supervised fine-tuning, rivaling top proprietary reasoning models.",
    "task": "NLP",
    "license": "MIT",
    "year": 2025,
    "org": "DeepSeek",
    "size": "671B (37B active)",
    "architecture": "DeepSeek-V3 Base + Large-scale Multi-Stage RL with self-verification reasoning.",
    "usage": "from openai import OpenAI\nclient = OpenAI(api_key=\"YOUR_KEY\", base_url=\"https://api.deepseek.com\")\nresponse = client.chat.completions.create(\n  model=\"deepseek-reasoner\",\n  messages=[{\"role\": \"user\", \"content\": \"Solve: What is the sum of integers from 1 to 100?\"}]\n)",
    "benchmarks": "AIME 2024: 79.8%, MATH-500: 97.3%, Codeforces: 96.3 percentile",
    "limitations": "Outputs lengthy reasoning chains which increase token consumption and response latency.",
    "popular": true,
    "url": "https://www.deepseek.com",
    "citations": [
      {
        "text": "DeepSeek-R1 Technical Report",
        "url": "https://arxiv.org/abs/2501.12948"
      }
    ]
  },
  {
    "name": "DeepSeek-R1-Distill-Qwen-32B",
    "type": "Model",
    "summary": "Dense 32B reasoning model distilled from DeepSeek-R1 onto Qwen2.5-32B, delivering top-tier mathematical and coding logic on consumer hardware.",
    "task": "NLP",
    "license": "MIT",
    "year": 2025,
    "org": "DeepSeek",
    "size": "32B params",
    "architecture": "Qwen2.5-32B backbone fine-tuned on 800k DeepSeek-R1 reasoning trajectories.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"deepseek-ai/DeepSeek-R1-Distill-Qwen-32B\", device_map=\"auto\")",
    "benchmarks": "AIME 2024: 72.6%, MATH-500: 94.3%, LiveCodeBench: 57.2%",
    "limitations": "Higher resource consumption than 8B models; requires ~20GB VRAM with 4-bit quantization.",
    "popular": true,
    "url": "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    "citations": [
      {
        "text": "DeepSeek-R1 Distillation",
        "url": "https://github.com/deepseek-ai/DeepSeek-R1"
      }
    ]
  },
  {
    "name": "DeepSeek-Coder-V2",
    "type": "Model",
    "summary": "Open-source mixture-of-experts code intelligence model supporting 338 programming languages and 128k context window.",
    "task": "AI Coding",
    "license": "MIT",
    "year": 2024,
    "org": "DeepSeek",
    "size": "236B (21B active)",
    "architecture": "MoE Transformer initialized from DeepSeek-V2 with code & math continual pre-training.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\ntokenizer = AutoTokenizer.from_pretrained(\"deepseek-ai/DeepSeek-Coder-V2-Instruct\", trust_remote_code=True)\nmodel = AutoModelForCausalLM.from_pretrained(\"deepseek-ai/DeepSeek-Coder-V2-Instruct\", trust_remote_code=True, device_map=\"auto\")",
    "benchmarks": "HumanEval: 90.2%, MBPP+: 76.2%, SWE-bench: 12.7%",
    "limitations": "High RAM/VRAM footprint for 236B model; requires distributed inference.",
    "popular": true,
    "url": "https://github.com/deepseek-ai/DeepSeek-Coder-V2",
    "citations": [
      {
        "text": "DeepSeek-Coder-V2 Paper",
        "url": "https://arxiv.org/abs/2406.11931"
      }
    ]
  },
  {
    "name": "Llama 3.3 (70B)",
    "type": "Model",
    "summary": "Meta's flagship open-weights instruction model delivering capabilities comparable to previous 405B models with 70B parameter efficiency.",
    "task": "NLP",
    "license": "Llama 3.3 Community License",
    "year": 2024,
    "org": "Meta AI",
    "size": "70B params",
    "architecture": "Autoregressive Transformer with Grouped-Query Attention (GQA) and 128k context length.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Llama-3.3-70B-Instruct\", device_map=\"auto\")",
    "benchmarks": "MMLU: 88.6%, HumanEval: 88.4%, GPQA: 50.5%",
    "limitations": "Commercial restriction for products exceeding 700M monthly active users.",
    "popular": true,
    "url": "https://ai.meta.com/llama/",
    "citations": [
      {
        "text": "Llama 3.3 Release",
        "url": "https://ai.meta.com/blog/llama-3-3/"
      }
    ]
  },
  {
    "name": "Llama 3.2 (3B)",
    "type": "Model",
    "summary": "Compact, on-device multilingual small language model optimized for edge devices, mobile compute, and high-speed local inference.",
    "task": "NLP",
    "license": "Llama 3.2 Community License",
    "year": 2024,
    "org": "Meta AI",
    "size": "3.21B params",
    "architecture": "Pruned and distilled Transformer with 128k context window support.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Llama-3.2-3B-Instruct\", device_map=\"auto\")",
    "benchmarks": "MMLU: 63.4%, GSM8K: 77.7%",
    "limitations": "Less capable on deep multi-step scientific and reasoning problems.",
    "popular": false,
    "url": "https://ai.meta.com/llama/",
    "citations": [
      {
        "text": "Llama 3.2 Announcement",
        "url": "https://ai.meta.com/blog/llama-3-2-connect-2024/"
      }
    ]
  },
  {
    "name": "Llama 3.2 Vision (11B)",
    "type": "Model",
    "summary": "Open-weights multimodal vision-language model capable of image understanding, visual reasoning, chart analysis, and document parsing.",
    "task": "Multimodal",
    "license": "Llama 3.2 Community License",
    "year": 2024,
    "org": "Meta AI",
    "size": "11B params",
    "architecture": "Vision encoder adapter integrated into Llama 3.2 text decoder.",
    "usage": "from transformers import MllamaForConditionalGeneration, AutoProcessor\nmodel = MllamaForConditionalGeneration.from_pretrained(\"meta-llama/Llama-3.2-11B-Vision-Instruct\", device_map=\"auto\")",
    "benchmarks": "DocVQA: 88.4%, ChartQA: 83.4%, MathVista: 57.2%",
    "limitations": "Vision encoder increases VRAM requirements during high-resolution multi-image processing.",
    "popular": true,
    "url": "https://ai.meta.com/llama/",
    "citations": [
      {
        "text": "Llama 3.2 Vision Model Card",
        "url": "https://ai.meta.com/blog/llama-3-2-connect-2024/"
      }
    ]
  },
  {
    "name": "Qwen 2.5 (72B)",
    "type": "Model",
    "summary": "Alibaba Cloud's flagship open LLM featuring world-class multilingual capabilities across 29+ languages, 128k context support, and leading coding benchmarks.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Alibaba Cloud",
    "size": "72.7B params",
    "architecture": "Dense Transformer with RoPE, SwiGLU, RMSNorm, and GQA.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"Qwen/Qwen2.5-72B-Instruct\", device_map=\"auto\")",
    "benchmarks": "MMLU: 86.8%, MATH: 83.1%, HumanEval: 86.6%",
    "limitations": "Full precision requires ~145GB VRAM; requires 4-bit quant to run on single 24GB/48GB GPU.",
    "popular": true,
    "url": "https://github.com/QwenLM/Qwen2.5",
    "citations": [
      {
        "text": "Qwen2.5 Announcement",
        "url": "https://qwenlm.github.io/blog/qwen2.5/"
      }
    ]
  },
  {
    "name": "Qwen 2.5-Coder (32B)",
    "type": "Model",
    "summary": "State-of-the-art open-source code generation model, matching GPT-4o on coding benchmarks while supporting 128k context tokens and code artifact editing.",
    "task": "AI Coding",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Alibaba Cloud",
    "size": "32.5B params",
    "architecture": "Transformer decoder specialized on 5.5 trillion code tokens.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"Qwen/Qwen2.5-Coder-32B-Instruct\", device_map=\"auto\")",
    "benchmarks": "HumanEval: 92.7%, EvalPlus: 87.2%, MultiPL-E: 84.1%",
    "limitations": "Optimized specifically for code; creative prose is slightly secondary.",
    "popular": true,
    "url": "https://github.com/QwenLM/Qwen2.5-Coder",
    "citations": [
      {
        "text": "Qwen2.5-Coder Technical Blog",
        "url": "https://qwenlm.github.io/blog/qwen2.5-coder/"
      }
    ]
  },
  {
    "name": "Qwen 2.5-VL (72B)",
    "type": "Model",
    "summary": "Vision-language foundation model capable of reading hour-long videos, parsing fine-grained document charts, and operating computer UIs via agent grounding.",
    "task": "Multimodal",
    "license": "Apache-2.0",
    "year": 2025,
    "org": "Alibaba Cloud",
    "size": "72B params",
    "architecture": "Dynamic resolution Vision Transformer (ViT) paired with Qwen 2.5 language backbone.",
    "usage": "from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor\nmodel = Qwen2_5_VLForConditionalGeneration.from_pretrained(\"Qwen/Qwen2.5-VL-72B-Instruct\", device_map=\"auto\")",
    "benchmarks": "DocVQA: 95.8%, Video-MME: 82.5%, MathVista: 71.9%",
    "limitations": "High token consumption on long video streams.",
    "popular": true,
    "url": "https://github.com/QwenLM/Qwen2.5-VL",
    "citations": [
      {
        "text": "Qwen2.5-VL Release",
        "url": "https://qwenlm.github.io/blog/qwen2.5-vl/"
      }
    ]
  },
  {
    "name": "Qwen 2.5-Math (72B)",
    "type": "Model",
    "summary": "Specialized mathematical reasoning model trained with chain-of-thought and tool-integrated reasoning (TIR) for solving complex olympiad-level math.",
    "task": "Research",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Alibaba Cloud",
    "size": "72.7B params",
    "architecture": "Dense Transformer tuned on bilingual math synthesis and code-assisted execution.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"Qwen/Qwen2.5-Math-72B-Instruct\", device_map=\"auto\")",
    "benchmarks": "MATH: 88.2%, GSM8K: 95.9%, OlympiadBench: 56.4%",
    "limitations": "Specialized strictly for math and quantitative calculations.",
    "popular": false,
    "url": "https://github.com/QwenLM/Qwen2.5-Math",
    "citations": [
      {
        "text": "Qwen2.5-Math Paper",
        "url": "https://arxiv.org/abs/2409.12122"
      }
    ]
  },
  {
    "name": "Claude 3.7 Sonnet",
    "type": "Model",
    "summary": "Anthropic's hybrid reasoning frontier model that dynamically switches between near-instant conversational responses and deep extended step-by-step thinking.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2025,
    "org": "Anthropic",
    "size": "Unknown",
    "architecture": "Transformer-based multimodal foundation model with controllable thinking budget tokens.",
    "usage": "import anthropic\nclient = anthropic.Anthropic()\nresponse = client.messages.create(\n  model=\"claude-3-7-sonnet-20250219\",\n  max_tokens=4096,\n  thinking={\"type\": \"enabled\", \"budget_tokens\": 2048},\n  messages=[{\"role\": \"user\", \"content\": \"Analyze complex architecture vulnerabilities.\"}]\n)",
    "benchmarks": "SWE-bench Verified: 70.3%, GPQA Diamond: 65.2%, TAU-bench: 81.2%",
    "limitations": "Extended reasoning uses token budget; proprietary API pricing.",
    "popular": true,
    "url": "https://www.anthropic.com/claude",
    "citations": [
      {
        "text": "Claude 3.7 Sonnet Announcement",
        "url": "https://www.anthropic.com/news/claude-3-7-sonnet"
      }
    ]
  },
  {
    "name": "Claude 3.5 Haiku",
    "type": "Model",
    "summary": "Anthropic's fastest language model, matching original Claude 3 Opus capabilities at blazing speed and lower operational cost.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Anthropic",
    "size": "Unknown",
    "architecture": "Compact distilled Transformer with Constitutional AI alignment.",
    "usage": "import anthropic\nclient = anthropic.Anthropic()\nresponse = client.messages.create(\n  model=\"claude-3-5-haiku-20241022\",\n  max_tokens=1024,\n  messages=[{\"role\": \"user\", \"content\": \"Extract entities from this invoice.\"}]\n)",
    "benchmarks": "MMLU: 80.9%, HumanEval: 75.9%, GPQA: 41.6%",
    "limitations": "Less suited for open-ended multi-page deep thesis analysis.",
    "popular": true,
    "url": "https://www.anthropic.com/claude",
    "citations": [
      {
        "text": "Claude 3.5 Haiku Release",
        "url": "https://www.anthropic.com/news/claude-3-5-haiku"
      }
    ]
  },
  {
    "name": "o3-mini",
    "type": "Model",
    "summary": "OpenAI's cost-efficient STEM, math, and coding reasoning model with selectable reasoning effort levels (low, medium, high) and function calling.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2025,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Reinforcement learning-trained reasoning model optimized for coding and STEM.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"o3-mini\",\n  reasoning_effort=\"medium\",\n  messages=[{\"role\": \"user\", \"content\": \"Design an optimal LRU cache in Rust.\"}]\n)",
    "benchmarks": "AIME 2024: 87.3%, Codeforces Rating: 2088, GPQA: 79.7%",
    "limitations": "Text only (no image modality input); reasoning adds latency.",
    "popular": true,
    "url": "https://openai.com",
    "citations": [
      {
        "text": "OpenAI o3-mini Announcement",
        "url": "https://openai.com/index/openai-o3-mini/"
      }
    ]
  },
  {
    "name": "Gemini 2.0 Flash",
    "type": "Model",
    "summary": "Google DeepMind's agentic multimodal model delivering real-time streaming audio/video generation, sub-second latency, and native tool execution.",
    "task": "Multimodal",
    "license": "Proprietary",
    "year": 2024,
    "org": "Google DeepMind",
    "size": "Unknown",
    "architecture": "Natively multimodal Mixture-of-Experts architecture supporting 1M context.",
    "usage": "from google import genai\nclient = genai.Client()\nresponse = client.models.generate_content(\n  model=\"gemini-2.0-flash\",\n  contents=\"Explain quantum computing simply.\"\n)",
    "benchmarks": "MMLU-Pro: 78.5%, MathVista: 68.3%, TTFT 2x faster than 1.5 Flash",
    "limitations": "API quota boundaries and regional service availability.",
    "popular": true,
    "url": "https://deepmind.google/technologies/gemini/",
    "citations": [
      {
        "text": "Gemini 2.0 Flash Release",
        "url": "https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/"
      }
    ]
  },
  {
    "name": "Gemini 2.0 Flash Thinking",
    "type": "Model",
    "summary": "Experimental reasoning edition of Gemini 2.0 Flash that outputs chain-of-thought steps for visual and logical problem-solving.",
    "task": "Research",
    "license": "Proprietary",
    "year": 2024,
    "org": "Google DeepMind",
    "size": "Unknown",
    "architecture": "Multimodal MoE with explicit reasoning tokens and reflection loops.",
    "usage": "from google import genai\nclient = genai.Client()\nresponse = client.models.generate_content(\n  model=\"gemini-2.0-flash-thinking-exp\",\n  contents=\"Solve this physics circuit diagram problem.\"\n)",
    "benchmarks": "MATH-500: 92.4%, AIME 2024: 74.3%",
    "limitations": "Experimental model with dynamic rate limits.",
    "popular": true,
    "url": "https://deepmind.google/technologies/gemini/",
    "citations": [
      {
        "text": "Gemini Thinking Model",
        "url": "https://deepmind.google/technologies/gemini/"
      }
    ]
  },
  {
    "name": "Phi-4 (14B)",
    "type": "Model",
    "summary": "Microsoft's 14B parameter state-of-the-art small reasoning model trained with highly synthetic, curated datasets for outsized math and science reasoning.",
    "task": "Research",
    "license": "MIT",
    "year": 2024,
    "org": "Microsoft",
    "size": "14.7B params",
    "architecture": "Dense Transformer trained with synthetic textbook data and multi-agent debate.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"microsoft/phi-4\", device_map=\"auto\")",
    "benchmarks": "MMLU: 84.8%, MATH-500: 80.4%, GPQA: 56.1%",
    "limitations": "Smaller parameter capacity limits broad factual knowledge retrieval.",
    "popular": true,
    "url": "https://huggingface.co/microsoft/phi-4",
    "citations": [
      {
        "text": "Phi-4 Technical Report",
        "url": "https://arxiv.org/abs/2412.08905"
      }
    ]
  },
  {
    "name": "Phi-3.5 MoE",
    "type": "Model",
    "summary": "Lightweight Mixture-of-Experts model from Microsoft activating 2 out of 16 experts (6.6B active params from 41.9B total), with 128k context support.",
    "task": "NLP",
    "license": "MIT",
    "year": 2024,
    "org": "Microsoft",
    "size": "41.9B (6.6B active)",
    "architecture": "16-expert MoE architecture with 128k context window.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"microsoft/Phi-3.5-MoE-instruct\", trust_remote_code=True, device_map=\"auto\")",
    "benchmarks": "MMLU: 78.9%, GSM8K: 85.1%",
    "limitations": "Requires distributed tensor routing for optimal MoE parallelization.",
    "popular": false,
    "url": "https://huggingface.co/microsoft/Phi-3.5-MoE-instruct",
    "citations": [
      {
        "text": "Phi-3.5 Announcement",
        "url": "https://azure.microsoft.com/en-us/blog/introducing-phi-3-5-small-language-models/"
      }
    ]
  },
  {
    "name": "Mistral Large 2 (123B)",
    "type": "Model",
    "summary": "Mistral AI's 123-billion parameter flagship model with 128k context window, advanced multilingual fluency in 80+ languages, and top code generation.",
    "task": "NLP",
    "license": "Mistral Research License / Commercial",
    "year": 2024,
    "org": "Mistral AI",
    "size": "123B params",
    "architecture": "Dense Transformer with 128k context window and enhanced function calling.",
    "usage": "from mistralai import Mistral\nclient = Mistral(api_key=\"API_KEY\")\nresponse = client.chat.complete(\n  model=\"mistral-large-latest\",\n  messages=[{\"role\": \"user\", \"content\": \"Analyze economic trends.\"}]\n)",
    "benchmarks": "MMLU: 84.0%, HumanEval: 92.0%, GSM8K: 91.2%",
    "limitations": "Commercial weights require paid enterprise license.",
    "popular": true,
    "url": "https://mistral.ai/news/mistral-large-2407/",
    "citations": [
      {
        "text": "Mistral Large 2 Announcement",
        "url": "https://mistral.ai/news/mistral-large-2407/"
      }
    ]
  },
  {
    "name": "Codestral 22B",
    "type": "Model",
    "summary": "Mistral AI's code generation model tailored for fill-in-the-middle (FIM), code completion, unit test drafting, and repository navigation across 80+ languages.",
    "task": "AI Coding",
    "license": "Mistral Non-Production License",
    "year": 2024,
    "org": "Mistral AI",
    "size": "22B params",
    "architecture": "Dense autoregressive model with 32k context and bidirectional FIM tokens.",
    "usage": "from mistralai import Mistral\nclient = Mistral(api_key=\"API_KEY\")\nresponse = client.fim.complete(\n  model=\"codestral-latest\",\n  prompt=\"def calculate_fibonacci(n):\",\n  suffix=\"return result\"\n)",
    "benchmarks": "HumanEval: 81.1%, MBPP: 78.2%, Spider: 67.5%",
    "limitations": "Non-commercial license for direct weights use unless licensed via Mistral API.",
    "popular": true,
    "url": "https://mistral.ai/news/codestral/",
    "citations": [
      {
        "text": "Codestral Announcement",
        "url": "https://mistral.ai/news/codestral/"
      }
    ]
  },
  {
    "name": "FLUX.1 Schnell",
    "type": "Model",
    "summary": "Black Forest Labs' ultra-fast 12B parameter open text-to-image rectified flow transformer, generating high-fidelity images in just 1 to 4 diffusion steps.",
    "task": "Image Generation",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Black Forest Labs",
    "size": "12B params",
    "architecture": "Hybrid multimodal rectified flow transformer with rotary position embeddings (RoPE).",
    "usage": "import torch\nfrom diffusers import FluxPipeline\npipe = FluxPipeline.from_pretrained(\"black-forest-labs/FLUX.1-schnell\", torch_dtype=torch.bfloat16)\nimage = pipe(\"A cozy cafe on Mars with neon lighting\", num_inference_steps=4).images[0]",
    "benchmarks": "ELO rating: 1140+ (Superior prompt adherence and in-image typography)",
    "limitations": "12B parameter weights require at least 12GB-16GB VRAM for GPU execution.",
    "popular": true,
    "url": "https://blackforestlabs.ai",
    "citations": [
      {
        "text": "FLUX.1 Release",
        "url": "https://blackforestlabs.ai/announcing-black-forest-labs/"
      }
    ]
  },
  {
    "name": "HunyuanVideo",
    "type": "Model",
    "summary": "Tencent's open-weights 13B dual-stream text-to-video foundation model delivering cinema-quality 720p 24fps video clips with exceptional physics consistency.",
    "task": "Video Generation",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Tencent",
    "size": "13B params",
    "architecture": "Dual-stream Diffusion Transformer (DiT) integrating 3D VAE with text-video cross-attention.",
    "usage": "from diffusers import HunyuanVideoPipeline\npipe = HunyuanVideoPipeline.from_pretrained(\"Tencent-Hunyuan/HunyuanVideo\", torch_dtype=torch.bfloat16)\nvideo = pipe(\"Astronaut riding a horse on the moon, cinematic 4k\").frames[0]",
    "benchmarks": "VBench Total: 85.2% (Top ranked open-source text-to-video model)",
    "limitations": "High VRAM requirements (recommended 44GB+ for unquantized inference).",
    "popular": true,
    "url": "https://github.com/Tencent/HunyuanVideo",
    "citations": [
      {
        "text": "HunyuanVideo Technical Report",
        "url": "https://arxiv.org/abs/2412.03603"
      }
    ]
  },
  {
    "name": "CogVideoX-5B",
    "type": "Model",
    "summary": "Open-source text-to-video foundation model from THUDM featuring 3D causal VAE and Expert Transformer blocks for 6-second video generation.",
    "task": "Video Generation",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "THUDM / Zhipu AI",
    "size": "5B params",
    "architecture": "3D Causal Convolutional VAE + Diffusion Transformer (DiT).",
    "usage": "from diffusers import CogVideoXPipeline\npipe = CogVideoXPipeline.from_pretrained(\"THUDM/CogVideoX-5b\", torch_dtype=torch.bfloat16)\nvideo = pipe(prompt=\"A golden retriever swimming in a crystal clear lake\").frames[0]",
    "benchmarks": "VBench dynamic degree: 82.7%, Motion smoothness: 84.1%",
    "limitations": "High memory utilization during spatial-temporal latent decompression.",
    "popular": false,
    "url": "https://github.com/THUDM/CogVideo",
    "citations": [
      {
        "text": "CogVideoX Paper",
        "url": "https://arxiv.org/abs/2408.06072"
      }
    ]
  },
  {
    "name": "Mochi 1",
    "type": "Model",
    "summary": "Genmo's open-weights 10B diffusion model for fluid, high-fidelity 480p video generation at 30fps with state-of-the-art prompt motion fidelity.",
    "task": "Video Generation",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Genmo",
    "size": "10B params",
    "architecture": "Asymmetric Diffusion Transformer (AsymmDiT) with continuous-time flow matching.",
    "usage": "from diffusers import MochiPipeline\npipe = MochiPipeline.from_pretrained(\"genmo/mochi-1-preview\", torch_dtype=torch.bfloat16)",
    "benchmarks": "High human preference score for prompt adherence in open text-to-video.",
    "limitations": "Requires 4x H100 or aggressive quantization for multi-second rendering.",
    "popular": false,
    "url": "https://github.com/genmoai/models",
    "citations": [
      {
        "text": "Mochi 1 Preview",
        "url": "https://www.genmo.ai/blog/mochi-1"
      }
    ]
  },
  {
    "name": "LTX-Video",
    "type": "Model",
    "summary": "Lightricks' open real-time video foundation model capable of generating high-definition 24fps video in under 5 seconds on commercial GPUs.",
    "task": "Video Generation",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Lightricks",
    "size": "2B params",
    "architecture": "Spatial-temporal DiT with distilled multi-step rectified flow.",
    "usage": "from diffusers import LTXPipeline\npipe = LTXPipeline.from_pretrained(\"Lightricks/LTX-Video\", torch_dtype=torch.bfloat16)",
    "benchmarks": "Generates 5-second video in ~4 seconds on a single NVIDIA A100.",
    "limitations": "Lower maximum resolution (768x512) before upscaling.",
    "popular": false,
    "url": "https://github.com/Lightricks/LTX-Video",
    "citations": [
      {
        "text": "LTX-Video Announcement",
        "url": "https://www.lightricks.com/ltx-video"
      }
    ]
  },
  {
    "name": "Whisper v3 Turbo",
    "type": "Model",
    "summary": "OpenAI's optimized speech recognition model providing near whisper-large-v3 accuracy at 8x faster inference speed.",
    "task": "Audio",
    "license": "MIT",
    "year": 2024,
    "org": "OpenAI",
    "size": "809M params",
    "architecture": "Pruned 4-layer decoder encoder-decoder Transformer.",
    "usage": "import whisper\nmodel = whisper.load_model(\"turbo\")\nresult = model.transcribe(\"audio.mp3\")\nprint(result[\"text\"])",
    "benchmarks": "Word Error Rate (WER): 7.1% on multilingual Common Voice; 8x inference speedup.",
    "limitations": "Slight accuracy trade-off in heavily accented or noisy audio compared to full large-v3.",
    "popular": true,
    "url": "https://github.com/openai/whisper",
    "citations": [
      {
        "text": "Whisper Turbo Release",
        "url": "https://github.com/openai/whisper/discussions/2363"
      }
    ]
  },
  {
    "name": "Kokoro-82M",
    "type": "Model",
    "summary": "Hexgrad's open-weights 82M parameter text-to-speech model producing studio-quality English and multilingual voice audio in real time on CPUs.",
    "task": "Audio",
    "license": "Apache-2.0",
    "year": 2025,
    "org": "Hexgrad",
    "size": "82M params",
    "architecture": "StyleTTS 2 architecture with ISTFT vocoder.",
    "usage": "from kokoro import KPipeline\npipeline = KPipeline(lang_code='a')\ngenerator = pipeline(\"Hello, welcome to AiVerse!\", voice='af_heart', speed=1.0)",
    "benchmarks": "Real-time factor < 0.1 on modern consumer CPUs; highly ranked on TTS Arena.",
    "limitations": "Trained primarily on English and select Romance languages.",
    "popular": true,
    "url": "https://huggingface.co/hexgrad/Kokoro-82M",
    "citations": [
      {
        "text": "Kokoro Model Card",
        "url": "https://huggingface.co/hexgrad/Kokoro-82M"
      }
    ]
  },
  {
    "name": "LangGraph",
    "type": "Framework",
    "summary": "Stateful orchestration library from LangChain for building cyclic, multi-agent workflows, human-in-the-loop oversight, and durable execution state.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2024,
    "org": "LangChain",
    "size": "N/A",
    "architecture": "Graph-based execution engine with state persistence checkpoints.",
    "usage": "from langgraph.graph import StateGraph, START, END\nbuilder = StateGraph(dict)\nbuilder.add_node(\"agent\", lambda state: {\"msg\": \"Done\"})\nbuilder.add_edge(START, \"agent\")\nbuilder.add_edge(\"agent\", END)\ngraph = builder.compile()",
    "benchmarks": "De facto industry standard for multi-agent loops and agentic workflow orchestration.",
    "limitations": "Requires structured state typing; higher complexity than linear chains.",
    "popular": true,
    "url": "https://github.com/langchain-ai/langgraph",
    "citations": [
      {
        "text": "LangGraph Docs",
        "url": "https://langchain-ai.github.io/langgraph/"
      }
    ]
  },
  {
    "name": "CrewAI",
    "type": "Framework",
    "summary": "Production-ready framework for orchestrating role-playing autonomous AI agents that collaborate seamlessly to solve complex tasks.",
    "task": "Productivity",
    "license": "MIT",
    "year": 2024,
    "org": "CrewAI Inc.",
    "size": "N/A",
    "architecture": "Role-based agent abstraction with task delegation and hierarchical memory.",
    "usage": "from crewai import Agent, Task, Crew\nresearcher = Agent(role='Researcher', goal='Investigate tech trends', memory=True)\ntask = Task(description='Summarize 2025 AI models', expected_output='Bullet summary', agent=researcher)\ncrew = Crew(agents=[researcher], tasks=[task])\ncrew.kickoff()",
    "benchmarks": "Over 25,000 GitHub stars; widely used in enterprise workflow automation.",
    "limitations": "Iterative agent loops can quickly trigger API rate limits without rate limiting.",
    "popular": true,
    "url": "https://github.com/crewAIInc/crewAI",
    "citations": [
      {
        "text": "CrewAI Documentation",
        "url": "https://docs.crewai.com"
      }
    ]
  },
  {
    "name": "AutoGen v0.4",
    "type": "Framework",
    "summary": "Microsoft's redesigned asynchronous event-driven multi-agent framework supporting distributed actor patterns, human intervention, and scalable conversations.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2024,
    "org": "Microsoft",
    "size": "N/A",
    "architecture": "Asynchronous actor-based event messaging architecture for agents.",
    "usage": "from autogen_agentchat.agents import AssistantAgent\nfrom autogen_ext.models.openai import OpenAIChatCompletionClient\nagent = AssistantAgent(\"assistant\", OpenAIChatCompletionClient(model=\"gpt-4o\"))",
    "benchmarks": "Benchmark leader for multi-agent benchmark problem solving (GAIA & SWE-bench).",
    "limitations": "Major API breaking rewrite in v0.4 from legacy v0.2.",
    "popular": true,
    "url": "https://github.com/microsoft/autogen",
    "citations": [
      {
        "text": "AutoGen v0.4 Architecture",
        "url": "https://microsoft.github.io/autogen/"
      }
    ]
  },
  {
    "name": "SGLang",
    "type": "Framework",
    "summary": "Fast LLM serving and programming engine featuring RadixAttention (KV cache sharing across multi-turn chats) for ultra-low latency inference and structured output.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "LMSYS",
    "size": "N/A",
    "architecture": "RadixAttention tree cache + interpreter-runtime co-design engine.",
    "usage": "import sglang as sgl\n@sgl.function\ndef qa(s, question):\n    s += sgl.user(question)\n    s += sgl.assistant(sgl.gen(\"answer\", max_tokens=100))",
    "benchmarks": "Up to 5x higher throughput on complex multi-turn chats compared to baseline vLLM.",
    "limitations": "Focuses on Linux x86 and NVIDIA CUDA environments.",
    "popular": true,
    "url": "https://github.com/sgl-project/sglang",
    "citations": [
      {
        "text": "SGLang Paper",
        "url": "https://arxiv.org/abs/2312.07104"
      }
    ]
  },
  {
    "name": "Unsloth",
    "type": "Framework",
    "summary": "Ultra-fast open-source fine-tuning framework providing 2x-5x faster training speeds and up to 80% lower VRAM memory usage for Llama, Mistral, Qwen, and DeepSeek.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Unsloth AI",
    "size": "N/A",
    "architecture": "Custom OpenAI Triton manual backpropagation GPU kernels.",
    "usage": "from unsloth import FastLanguageModel\nmodel, tokenizer = FastLanguageModel.from_pretrained(\n    model_name=\"unsloth/Llama-3.3-70B-Instruct-bnb-4bit\",\n    max_seq_length=2048,\n    load_in_4bit=True\n)",
    "benchmarks": "5x faster training, 0% accuracy loss compared to standard Hugging Face Trainer.",
    "limitations": "Exclusively tailored for NVIDIA GPUs (Compute Capability 7.0+).",
    "popular": true,
    "url": "https://github.com/unslothai/unsloth",
    "citations": [
      {
        "text": "Unsloth Documentation",
        "url": "https://docs.unsloth.ai"
      }
    ]
  },
  {
    "name": "Axolotl",
    "type": "Framework",
    "summary": "Streamlined tool for fine-tuning LLMs with SFT, DPO, KTO, and LoRA across various architectures using simple declarative YAML config files.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Open Source",
    "size": "N/A",
    "architecture": "Modular PyTorch/Deepspeed/FSDP harness for scalable training.",
    "usage": "accelerate launch -m axolotl.cli.train config.yaml",
    "benchmarks": "Used to train OpenHermes, Zephyr, and top open-weights community models.",
    "limitations": "Complex multi-node configurations require solid Linux cluster admin experience.",
    "popular": false,
    "url": "https://github.com/axolotl-ai-cloud/axolotl",
    "citations": [
      {
        "text": "Axolotl Repository",
        "url": "https://github.com/axolotl-ai-cloud/axolotl"
      }
    ]
  },
  {
    "name": "DSPy",
    "type": "Framework",
    "summary": "Stanford NLP's framework for algorithmically optimizing language model prompts, weights, and retrieval parameters via declarative modules and automatic teleprompters.",
    "task": "Research",
    "license": "MIT",
    "year": 2024,
    "org": "Stanford NLP",
    "size": "N/A",
    "architecture": "Declarative LM programming framework with compiler/optimizer loop.",
    "usage": "import dspy\ndspy.settings.configure(lm=dspy.OpenAI(model='gpt-4o'))\nclass MultiHopQA(dspy.Module):\n    def __init__(self):\n        self.generate_query = dspy.ChainOfThought(\"claim -> query\")\n        self.retrieve = dspy.Retrieve(k=3)",
    "benchmarks": "Improves pipeline accuracy by 25%-40% compared to static prompt chains.",
    "limitations": "Requires learning module abstractions rather than writing raw prompt strings.",
    "popular": true,
    "url": "https://github.com/stanfordnlp/dspy",
    "citations": [
      {
        "text": "DSPy Paper",
        "url": "https://arxiv.org/abs/2310.03714"
      }
    ]
  },
  {
    "name": "Smolagents",
    "type": "Framework",
    "summary": "Hugging Face's lightweight Python-first agent library where agents write executable Python code directly instead of parsing JSON action strings.",
    "task": "AI Coding",
    "license": "Apache-2.0",
    "year": 2025,
    "org": "Hugging Face",
    "size": "~1,000 LOC",
    "architecture": "CodeAgent execution loop running in a secure Python sandbox.",
    "usage": "from smolagents import CodeAgent, HfApiModel, DuckDuckGoSearchTool\nagent = CodeAgent(tools=[DuckDuckGoSearchTool()], model=HfApiModel())\nagent.run(\"What is the latest score of the Mars Rover mission?\")",
    "benchmarks": "30% fewer token overhead and higher tool success rate on GAIA benchmarks.",
    "limitations": "Code execution requires sandbox container isolation for untrusted user inputs.",
    "popular": true,
    "url": "https://github.com/huggingface/smolagents",
    "citations": [
      {
        "text": "Smolagents Launch",
        "url": "https://huggingface.co/blog/smolagents"
      }
    ]
  },
  {
    "name": "Instructor",
    "type": "Framework",
    "summary": "Python and TypeScript library built on Pydantic to extract guaranteed, strictly validated structured data from any LLM provider.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2024,
    "org": "Jason Liu",
    "size": "N/A",
    "architecture": "Pydantic schema injection and automatic validation retry handler.",
    "usage": "import instructor\nfrom openai import OpenAI\nfrom pydantic import BaseModel\n\nclient = instructor.from_openai(OpenAI())\nclass User(BaseModel):\n    name: str\n    age: int\n\nuser = client.chat.completions.create(\n    model=\"gpt-4o\",\n    response_model=User,\n    messages=[{\"role\": \"user\", \"content\": \"Alice is 28 years old.\"}]\n)",
    "benchmarks": "Eliminates structured JSON extraction parse failures across 10+ LLM backends.",
    "limitations": "Relies on underlying LLM function calling or tool use capabilities.",
    "popular": true,
    "url": "https://github.com/jxnl/instructor",
    "citations": [
      {
        "text": "Instructor Docs",
        "url": "https://python.useinstructor.com"
      }
    ]
  },
  {
    "name": "Outlines",
    "type": "Framework",
    "summary": "Guided generation framework from .txt that forces LLMs to generate text conforming strictly to regular expressions, JSON schemas, or context-free grammars with mathematical guarantee.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "dottxt",
    "size": "N/A",
    "architecture": "Finite-state machine (FSM) token mask generator for autoregressive sampling.",
    "usage": "import outlines\nmodel = outlines.models.transformers(\"meta-llama/Llama-3.2-3B\")\ngenerator = outlines.generate.json(model, UserSchema)\nresult = generator(\"Extract user details from text\")",
    "benchmarks": "Zero JSON syntax errors with negligible sampling runtime overhead.",
    "limitations": "Requires tokenizer vocabulary and logit indexing access.",
    "popular": false,
    "url": "https://github.com/dottxt-ai/outlines",
    "citations": [
      {
        "text": "Outlines Paper",
        "url": "https://arxiv.org/abs/2307.09702"
      }
    ]
  },
  {
    "name": "LiteLLM",
    "type": "Framework",
    "summary": "Universal proxy and Python SDK to call 100+ LLM APIs (OpenAI, Anthropic, Bedrock, Vertex, Ollama, Groq) using the standard OpenAI format with load balancing and fallbacks.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2024,
    "org": "BerriAI",
    "size": "N/A",
    "architecture": "Unified API gateway proxy and translation layer.",
    "usage": "from litellm import completion\nresponse = completion(\n    model=\"anthropic/claude-3-5-sonnet-20240620\",\n    messages=[{\"role\": \"user\", \"content\": \"Hello World\"}]\n)",
    "benchmarks": "99.99% gateway reliability with automatic multi-provider failover routing.",
    "limitations": "Gateway proxy adds slight network hop (~5ms) in high-throughput setups.",
    "popular": true,
    "url": "https://github.com/BerriAI/litellm",
    "citations": [
      {
        "text": "LiteLLM Documentation",
        "url": "https://docs.litellm.ai"
      }
    ]
  },
  {
    "name": "Transformers.js",
    "type": "Framework",
    "summary": "State-of-the-art ML library from Hugging Face that runs pretrained models directly inside web browsers and Node.js with zero server dependencies via ONNX Runtime and WebGPU.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Hugging Face",
    "size": "N/A",
    "architecture": "WebAssembly + WebGPU execution runtime for ONNX neural network models.",
    "usage": "import { pipeline } from '@huggingface/transformers';\nconst classifier = await pipeline('sentiment-analysis');\nconst output = await classifier('I love running AI locally in my browser!');",
    "benchmarks": "Up to 10x speedup utilizing client-side WebGPU acceleration in Chrome/Edge.",
    "limitations": "Model size bounded by client browser RAM / VRAM allocation.",
    "popular": true,
    "url": "https://github.com/huggingface/transformers.js",
    "citations": [
      {
        "text": "Transformers.js Docs",
        "url": "https://huggingface.co/docs/transformers.js"
      }
    ]
  },
  {
    "name": "Distilabel",
    "type": "Framework",
    "summary": "Argilla's framework for synthetic data generation and AI feedback (RLAIF) capable of scaling pipelines for multi-turn DPO, preference datasets, and instruction fine-tuning.",
    "task": "Research",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Argilla",
    "size": "N/A",
    "architecture": "Step-based data synthesis and evaluation pipeline orchestrator.",
    "usage": "from distilabel.pipeline import Pipeline\nwith Pipeline(\"SyntheticData\") as pipeline:\n    # Define generation steps and LLM judges",
    "benchmarks": "Powered the creation of UltraFeedback, OpenHermes, and benchmark preference datasets.",
    "limitations": "Generates high API usage costs when scaling large synthetic batches.",
    "popular": false,
    "url": "https://github.com/argilla-io/distilabel",
    "citations": [
      {
        "text": "Distilabel Docs",
        "url": "https://distilabel.argilla.io"
      }
    ]
  },
  {
    "name": "OpenRouter",
    "type": "Platform",
    "summary": "Unified API gateway and marketplace routing to 200+ AI models across dozens of providers with automatic failover, cost optimization, and open community stats.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenRouter",
    "size": "200+ models",
    "architecture": "Low-latency global edge API router with multi-provider fallback.",
    "usage": "fetch(\"https://openrouter.ai/api/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer YOUR_KEY\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    \"model\": \"deepseek/deepseek-r1\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}]\n  })\n})",
    "benchmarks": "Industry leader in model choice and real-time LLM token throughput telemetry.",
    "limitations": "Upstream provider outages can impact specific model routes.",
    "popular": true,
    "url": "https://openrouter.ai",
    "citations": [
      {
        "text": "OpenRouter",
        "url": "https://openrouter.ai"
      }
    ]
  },
  {
    "name": "GroqCloud",
    "type": "Platform",
    "summary": "Ultra-fast AI inference platform powered by Groq's custom LPU (Language Processing Unit) silicon, generating 500+ tokens per second for open LLMs.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2024,
    "org": "Groq",
    "size": "LPU clusters",
    "architecture": "Deterministic tensor streaming architecture on custom silicon.",
    "usage": "from groq import Groq\nclient = Groq(api_key=\"GROQ_API_KEY\")\nresponse = client.chat.completions.create(\n    model=\"llama-3.3-70b-versatile\",\n    messages=[{\"role\": \"user\", \"content\": \"Summarize this live.\"}]\n)",
    "benchmarks": "550+ tokens/sec on Llama 3.3 70B, over 10x faster than standard GPU clouds.",
    "limitations": "Limited context window lengths compared to huge GPU memory clusters.",
    "popular": true,
    "url": "https://groq.com",
    "citations": [
      {
        "text": "Groq LPU Architecture",
        "url": "https://groq.com"
      }
    ]
  },
  {
    "name": "Modal",
    "type": "Platform",
    "summary": "Serverless cloud compute platform designed for running GPU-accelerated Python containers, AI microservices, fine-tuning, and inference in seconds.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2024,
    "org": "Modal Labs",
    "size": "Elastic GPU cloud",
    "architecture": "Containerized serverless runtime with cold starts under 2 seconds.",
    "usage": "import modal\napp = modal.App(\"fast-inference\")\n@app.function(gpu=\"A100\")\ndef generate():\n    return \"Generated from serverless GPU\"",
    "benchmarks": "Industry-leading cold start latency for containerized PyTorch and vLLM workloads.",
    "limitations": "Requires Python-centric infrastructure design.",
    "popular": true,
    "url": "https://modal.com",
    "citations": [
      {
        "text": "Modal Documentation",
        "url": "https://modal.com/docs"
      }
    ]
  },
  {
    "name": "Fireworks AI",
    "type": "Platform",
    "summary": "Production-grade generative AI inference platform delivering blazing fast latency and cost efficiency for open-weights vision, audio, and language models.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2024,
    "org": "Fireworks AI",
    "size": "Cloud API",
    "architecture": "Custom inference engine with fine-grained speculative decoding and LoRA multiplexing.",
    "usage": "from openai import OpenAI\nclient = OpenAI(base_url=\"https://api.fireworks.ai/inference/v1\", api_key=\"FW_KEY\")\nresponse = client.chat.completions.create(model=\"accounts/fireworks/models/deepseek-v3\", messages=[...])",
    "benchmarks": "Sub-100ms time-to-first-token and ultra-high concurrency.",
    "limitations": "Proprietary cloud platform.",
    "popular": true,
    "url": "https://fireworks.ai",
    "citations": [
      {
        "text": "Fireworks AI Platform",
        "url": "https://fireworks.ai"
      }
    ]
  },
  {
    "name": "Cerebras Cloud",
    "type": "Platform",
    "summary": "Wafer-Scale AI compute platform powered by CS-3 systems, delivering up to 2,000 tokens per second for Llama 3 models.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2024,
    "org": "Cerebras Systems",
    "size": "Wafer-scale engine",
    "architecture": "WSE-3 single-die wafer processor with 900,000 AI cores and 44GB on-chip SRAM.",
    "usage": "from cerebras.cloud.sdk import Cerebras\nclient = Cerebras(api_key=\"CEREBRAS_API_KEY\")\nresponse = client.chat.completions.create(model=\"llama3.1-70b\", messages=[{\"role\": \"user\", \"content\": \"Fast code review.\"}])",
    "benchmarks": "2,100 tokens/sec on Llama 3.1 8B, 450 tokens/sec on 70B.",
    "limitations": "Proprietary wafer hardware; limited custom model import options.",
    "popular": false,
    "url": "https://cerebras.ai",
    "citations": [
      {
        "text": "Cerebras Inference",
        "url": "https://cerebras.ai/inference"
      }
    ]
  },
  {
    "name": "llama.cpp",
    "type": "Platform",
    "summary": "Pure C/C++ inference implementation for LLMs with GGUF quantization, enabling fast CPU and GPU execution across Mac Metal, Windows, and Linux.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2023,
    "org": "Georgi Gerganov",
    "size": "N/A",
    "architecture": "C++ core with GGML tensor library and low-precision integer quantization.",
    "usage": "./llama-cli -m models/llama-3.3-70b-instruct.Q4_K_M.gguf -p \"Explain gravity\" -n 128",
    "benchmarks": "Underpins Ollama, LM Studio, and local AI on Apple Silicon.",
    "limitations": "Manual command line configuration needed for advanced distributed setups.",
    "popular": true,
    "url": "https://github.com/ggerganov/llama.cpp",
    "citations": [
      {
        "text": "llama.cpp GitHub",
        "url": "https://github.com/ggerganov/llama.cpp"
      }
    ]
  },
  {
    "name": "RunPod",
    "type": "Platform",
    "summary": "Globally distributed cloud GPU platform offering on-demand instances and serverless GPU endpoints for AI training and inference at low cost.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2023,
    "org": "RunPod Inc.",
    "size": "Global GPU pods",
    "architecture": "Kubernetes-orchestrated bare-metal and serverless GPU container fabric.",
    "usage": "import runpod\nrunpod.api_key = \"KEY\"\nendpoint = runpod.Endpoint(\"ENDPOINT_ID\")\nrun_request = endpoint.run({\"input\": {\"prompt\": \"AI art\"}})\nprint(run_request.output())",
    "benchmarks": "Top cost-to-performance provider for indie AI builders and startups.",
    "limitations": "Spot instance availability can fluctuate based on global demand.",
    "popular": true,
    "url": "https://www.runpod.io",
    "citations": [
      {
        "text": "RunPod Docs",
        "url": "https://docs.runpod.io"
      }
    ]
  },
  {
    "name": "DeepInfra",
    "type": "Platform",
    "summary": "Serverless pay-per-token API platform for hosting open-source LLMs, embeddings, speech-to-text, and image generation models at scale.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2023,
    "org": "DeepInfra",
    "size": "Cloud API",
    "architecture": "Elastic GPU cluster with automatic scale-to-zero serverless endpoints.",
    "usage": "import openai\nclient = openai.OpenAI(api_key=\"DEEPINFRA_KEY\", base_url=\"https://api.deepinfra.com/v1/openai\")\nres = client.chat.completions.create(model=\"meta-llama/Llama-3.3-70B-Instruct\", messages=[...])",
    "benchmarks": "Low cost per million tokens with sub-200ms latency.",
    "limitations": "Proprietary cloud orchestration.",
    "popular": false,
    "url": "https://deepinfra.com",
    "citations": [
      {
        "text": "DeepInfra",
        "url": "https://deepinfra.com"
      }
    ]
  },
  {
    "name": "LangSmith",
    "type": "Platform",
    "summary": "Enterprise LLMOps platform from LangChain for debugging, testing, evaluating, and monitoring LLM applications and complex agent workflows.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2023,
    "org": "LangChain",
    "size": "Cloud / Self-hosted",
    "architecture": "Distributed telemetry tracing backend with prompt management and online evaluation.",
    "usage": "export LANGCHAIN_TRACING_V2=\"true\"\nexport LANGCHAIN_API_KEY=\"your-api-key\"\n# All LangChain & LangGraph calls automatically trace to dashboard",
    "benchmarks": "Standard tracing tool for production agent developers.",
    "limitations": "Full tracing storage can be expensive at massive enterprise scale.",
    "popular": true,
    "url": "https://smith.langchain.com",
    "citations": [
      {
        "text": "LangSmith Documentation",
        "url": "https://docs.smith.langchain.com"
      }
    ]
  },
  {
    "name": "Weights & Biases Weave",
    "type": "Platform",
    "summary": "Lightweight LLM observability and evaluation toolkit from W&B that logs, versions, and systematically evaluates generative AI pipelines.",
    "task": "MLOps",
    "license": "Apache-2.0 / SaaS",
    "year": 2024,
    "org": "Weights & Biases",
    "size": "N/A",
    "architecture": "Decorated Python tracing library with automated schema extraction and web UI.",
    "usage": "import weave\nweave.init('my-ai-app')\n@weave.op()\ndef generate_response(prompt: str) -> str:\n    # Automatically tracked in dashboard\n    return \"Response\"",
    "benchmarks": "Integrated into W&B ML tracking ecosystem used by top frontier AI labs.",
    "limitations": "Requires W&B account login for web UI dashboard.",
    "popular": false,
    "url": "https://wandb.ai/site/weave",
    "citations": [
      {
        "text": "Weave Docs",
        "url": "https://weave-docs.wandb.ai"
      }
    ]
  },
  {
    "name": "Helicone",
    "type": "Platform",
    "summary": "Open-source LLM observability, smart proxy caching, rate limiting, and cost tracking platform designed for production AI teams.",
    "task": "MLOps",
    "license": "Apache-2.0 / Cloud",
    "year": 2023,
    "org": "Helicone",
    "size": "N/A",
    "architecture": "Edge reverse proxy with low-latency async logging and response caching.",
    "usage": "from openai import OpenAI\nclient = OpenAI(base_url=\"https://oai.helicone.ai/v1\", default_headers={\"Helicone-Auth\": \"Bearer HELICONE_API_KEY\"})",
    "benchmarks": "Caches repeated semantic queries reducing API bills by up to 40%.",
    "limitations": "Requires routing OpenAI SDK traffic through Helicone proxy URL.",
    "popular": true,
    "url": "https://www.helicone.ai",
    "citations": [
      {
        "text": "Helicone Documentation",
        "url": "https://docs.helicone.ai"
      }
    ]
  },
  {
    "name": "Portkey AI Gateway",
    "type": "Platform",
    "summary": "Production AI gateway offering load balancing, fallback routing, prompt management, and guardrails across 250+ LLMs with sub-1ms overhead.",
    "task": "MLOps",
    "license": "Apache-2.0 / Cloud",
    "year": 2023,
    "org": "Portkey AI",
    "size": "N/A",
    "architecture": "Ultra-fast C++ based reverse proxy and control plane.",
    "usage": "from portkey_ai import Portkey\nportkey = Portkey(api_key=\"PORTKEY_API_KEY\")\nresponse = portkey.chat.completions.create(model=\"gpt-4o\", messages=[{\"role\": \"user\", \"content\": \"Hello!\"}])",
    "benchmarks": "<1ms proxy latency overhead; 99.999% production routing reliability.",
    "limitations": "Requires integrating Portkey headers or SDK wrappers.",
    "popular": false,
    "url": "https://portkey.ai",
    "citations": [
      {
        "text": "Portkey Docs",
        "url": "https://docs.portkey.ai"
      }
    ]
  },
  {
    "name": "FineWeb & FineWeb-Edu",
    "type": "Dataset",
    "summary": "15-trillion token open web pretraining dataset from Hugging Face, including FineWeb-Edu filtered with automated AI educational quality scoring.",
    "task": "NLP",
    "license": "ODC-By 1.0",
    "year": 2024,
    "org": "Hugging Face",
    "size": "15 Trillion tokens (44 TB)",
    "architecture": "Curated dataset derived from 96 Common Crawl dumps with MinHash deduplication.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"HuggingFaceFW/fineweb-edu\", name=\"sample-100BT\", split=\"train\", streaming=True)",
    "benchmarks": "Pretraining on FineWeb-Edu yields higher MMLU per token than Meta Llama 3 web filtering.",
    "limitations": "Massive multi-terabyte download requirement for full uncompressed sets.",
    "popular": true,
    "url": "https://huggingface.co/datasets/HuggingFaceFW/fineweb",
    "citations": [
      {
        "text": "FineWeb Announcement",
        "url": "https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-details"
      }
    ]
  },
  {
    "name": "Cosmopedia",
    "type": "Dataset",
    "summary": "Largest synthetic dataset to date, containing over 30 million files and 25 billion tokens of synthetic textbooks, blog posts, and courseware generated by Mixtral.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "Hugging Face",
    "size": "25 Billion tokens",
    "architecture": "Synthetic curriculum generated with prompt engineering over Web of Science and Wikipedia topics.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"HuggingFaceTB/cosmopedia\", split=\"train\", streaming=True)",
    "benchmarks": "Used to train SmolLM and high-density knowledge small models.",
    "limitations": "Synthetic data contains stylistic generation quirks if unfiltered.",
    "popular": false,
    "url": "https://huggingface.co/datasets/HuggingFaceTB/cosmopedia",
    "citations": [
      {
        "text": "Cosmopedia Blog",
        "url": "https://huggingface.co/blog/cosmopedia"
      }
    ]
  },
  {
    "name": "UltraFeedback",
    "type": "Dataset",
    "summary": "Large-scale preference dataset containing 64,000 multi-turn prompts with responses evaluated by GPT-4 across instruction following, truthfulness, and quality.",
    "task": "NLP",
    "license": "MIT",
    "year": 2024,
    "org": "Argilla",
    "size": "64k prompts (250k pairs)",
    "architecture": "Binarized and scalar preference alignment dataset for DPO and KTO.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"HuggingFaceH4/ultrafeedback_binarized\", split=\"train_prefs\")",
    "benchmarks": "Gold standard preference dataset for training Zephyr, Starling, and top DPO models.",
    "limitations": "Relies on GPT-4 evaluation scores as ground truth.",
    "popular": true,
    "url": "https://huggingface.co/datasets/argilla/ultrafeedback",
    "citations": [
      {
        "text": "UltraFeedback Paper",
        "url": "https://arxiv.org/abs/2310.01377"
      }
    ]
  },
  {
    "name": "OpenHermes 2.5",
    "type": "Dataset",
    "summary": "Curated dataset of 1 million diverse conversation turns, code snippets, reasoning chains, and roleplay examples used to fine-tune state-of-the-art open models.",
    "task": "NLP",
    "license": "MIT",
    "year": 2023,
    "org": "Teknium",
    "size": "1,001,551 examples",
    "architecture": "Curated collection of synthetic and human-annotated instruction datasets (ShareGPT, Airoboros, GPTeacher).",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"teknium/OpenHermes-2.5\", split=\"train\")",
    "benchmarks": "Trained OpenHermes-2.5-Mistral-7B to outperform standard 70B models in 2023.",
    "limitations": "Varied data sources include diverse subjective annotation quality.",
    "popular": true,
    "url": "https://huggingface.co/datasets/teknium/OpenHermes-2.5",
    "citations": [
      {
        "text": "OpenHermes 2.5 Dataset",
        "url": "https://huggingface.co/datasets/teknium/OpenHermes-2.5"
      }
    ]
  },
  {
    "name": "MATH-500",
    "type": "Dataset",
    "summary": "Standardized 500-problem evaluation benchmark subset of the original MATH competition dataset used to measure multi-step mathematical reasoning in frontier models.",
    "task": "Research",
    "license": "MIT",
    "year": 2024,
    "org": "OpenAI / Benchmark",
    "size": "500 competition problems",
    "architecture": "Challenging math competition problems spanning algebra, geometry, number theory, and calculus.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"HuggingFaceH4/MATH-500\", split=\"test\")",
    "benchmarks": "Primary benchmark for OpenAI o1, o3-mini, and DeepSeek-R1 reasoning comparisons.",
    "limitations": "Static problem set creates potential risk of training data contamination over time.",
    "popular": true,
    "url": "https://huggingface.co/datasets/HuggingFaceH4/MATH-500",
    "citations": [
      {
        "text": "MATH Benchmark Paper",
        "url": "https://arxiv.org/abs/2103.03874"
      }
    ]
  },
  {
    "name": "SWE-bench Verified",
    "type": "Dataset",
    "summary": "Human-verified subset of 500 real-world GitHub issues and unit test pull requests used to evaluate autonomous software engineering AI agents.",
    "task": "AI Coding",
    "license": "MIT",
    "year": 2024,
    "org": "Princeton / OpenAI",
    "size": "500 verified GitHub issues",
    "architecture": "Dockerized reproducible environment harness across 12 major Python repositories.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"princeton-nlp/SWE-bench_Verified\", split=\"test\")",
    "benchmarks": "The global gold standard benchmark for Devin, Claude 3.7 Sonnet, and autonomous coding agents.",
    "limitations": "Requires Dockerized test harness execution for each evaluated issue.",
    "popular": true,
    "url": "https://www.swebench.com",
    "citations": [
      {
        "text": "SWE-bench Verified",
        "url": "https://openai.com/index/introducing-swe-bench-verified/"
      }
    ]
  },
  {
    "name": "LiveCodeBench",
    "type": "Dataset",
    "summary": "Holistic, continuously updated, contamination-free code benchmark collected from LeetCode, AtCoder, and Codeforces to test modern LLM coding capabilities.",
    "task": "AI Coding",
    "license": "MIT",
    "year": 2024,
    "org": "LiveCodeBench Team",
    "size": "1,000+ problems",
    "architecture": "Time-stamped competitive coding problems with automated evaluation harnesses.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"livecodebench/code_generation_lite\", split=\"test\")",
    "benchmarks": "Prevents benchmark memorization through temporal problem filtering.",
    "limitations": "Focuses on competitive algorithm logic rather than large-scale repo architecture.",
    "popular": false,
    "url": "https://livecodebench.github.io",
    "citations": [
      {
        "text": "LiveCodeBench Paper",
        "url": "https://arxiv.org/abs/2403.07974"
      }
    ]
  },
  {
    "name": "GAIA Benchmark",
    "type": "Dataset",
    "summary": "General AI Assistant benchmark testing AI agents on multi-modal, tool-use, web browsing, and multi-step complex real-world questions that humans solve easily.",
    "task": "Research",
    "license": "CC BY-SA 4.0",
    "year": 2023,
    "org": "Meta / Hugging Face / AutoGPT",
    "size": "466 questions",
    "architecture": "3-tier difficulty question set with multimodal attachments (PDFs, spreadsheets, images).",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"gaia-benchmark/GAIA\", \"2023_all\", split=\"validation\")",
    "benchmarks": "Humans score 92%, whereas leading AI models historically score 30%-60%.",
    "limitations": "Requires full web browsing and python tool execution environment to run evals.",
    "popular": true,
    "url": "https://huggingface.co/spaces/gaia-benchmark/leaderboard",
    "citations": [
      {
        "text": "GAIA Benchmark Paper",
        "url": "https://arxiv.org/abs/2311.12983"
      }
    ]
  },
  {
    "name": "LMSYS Chatbot Arena Conversations",
    "type": "Dataset",
    "summary": "Open dataset of over 1 million real-world pairwise prompt conversations and human preference votes collected from the LMSYS Chatbot Arena.",
    "task": "NLP",
    "license": "LMSYS Terms / Research",
    "year": 2024,
    "org": "LMSYS",
    "size": "1,000,000+ battles",
    "architecture": "Crowdsourced human side-by-side preference votes with model identities revealed post-vote.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"lmsys/chatbot_arena_conversations\", split=\"train\")",
    "benchmarks": "Industry standard for calculating ELO ratings of frontier LLMs.",
    "limitations": "Subject to prompt distribution biases of Arena visitors.",
    "popular": true,
    "url": "https://chat.lmsys.org",
    "citations": [
      {
        "text": "LMSYS Chatbot Arena Paper",
        "url": "https://arxiv.org/abs/2403.04132"
      }
    ]
  },
  {
    "name": "Dolma Dataset",
    "type": "Dataset",
    "summary": "3-trillion token open pretraining dataset curated by the Allen Institute for AI (AI2) to power the open-source OLMo language models.",
    "task": "NLP",
    "license": "ODC-By 1.0",
    "year": 2024,
    "org": "AI2 (Allen Institute for AI)",
    "size": "3 Trillion tokens",
    "architecture": "De-duplicated, safety-filtered web corpus from Common Crawl, Reddit, peS2o, and GitHub.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"allenai/dolma\", split=\"train\", streaming=True)",
    "benchmarks": "Fully open pretraining recipe allowing 100% scientific reproducibility for LLM training.",
    "limitations": "Full dataset download requires high bandwidth and petabyte-scale storage.",
    "popular": false,
    "url": "https://github.com/allenai/dolma",
    "citations": [
      {
        "text": "Dolma Technical Paper",
        "url": "https://arxiv.org/abs/2402.00159"
      }
    ]
  },
  {
    "name": "WildChat",
    "type": "Dataset",
    "summary": "Corpus of 1 million real-world user interactions with ChatGPT across 100+ languages, including moderation annotations and toxicity analysis.",
    "task": "NLP",
    "license": "ODC-By 1.0",
    "year": 2024,
    "org": "Allen Institute for AI",
    "size": "1,000,000 conversations",
    "architecture": "Real-world conversational turns with multi-turn context and safety classifications.",
    "usage": "from datasets import load_dataset\nds = load_dataset(\"allenai/WildChat-1M\", split=\"train\")",
    "benchmarks": "Critical dataset for studying user prompt drift, jailbreak attempts, and multilingual intent.",
    "limitations": "Includes raw unfiltered user queries requiring safety filtering during fine-tuning.",
    "popular": false,
    "url": "https://huggingface.co/datasets/allenai/WildChat-1M",
    "citations": [
      {
        "text": "WildChat Paper",
        "url": "https://arxiv.org/abs/2405.01070"
      }
    ]
  },
  {
    "name": "Arena-Hard-Auto",
    "type": "Dataset",
    "summary": "Benchmark of 500 challenging, hard-to-distinguish real-world queries evaluated automatically using LLM-as-a-judge with high correlation to human Chatbot Arena rank.",
    "task": "Research",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "LMSYS",
    "size": "500 complex prompts",
    "architecture": "Hard prompt filtering pipeline with GPT-4-Judge pairwise win rate calculations.",
    "usage": "python -m arena_hard.eval --model-answers answers.jsonl",
    "benchmarks": "98% rank correlation with human Chatbot Arena ELO at a fraction of human testing cost.",
    "limitations": "Susceptible to LLM judge biases such as length and formatting preference.",
    "popular": true,
    "url": "https://github.com/sunshanghai/arena-hard-auto",
    "citations": [
      {
        "text": "Arena-Hard-Auto Release",
        "url": "https://lmsys.org/blog/2024-04-19-arena-hard/"
      }
    ]
  },
  {
    "name": "v0 by Vercel",
    "type": "AI",
    "summary": "Generative UI design platform that creates production-grade, accessible React components and full frontend pages styled with Tailwind CSS and Shadcn UI from natural prompts.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2024,
    "org": "Vercel",
    "size": "N/A",
    "architecture": "Web Application / Fine-tuned LLM with React Component AST Compiler.",
    "usage": "Visit v0.dev, enter prompt: \"Modern crypto portfolio dashboard with dark mode charts\", and click Copy Code to paste into your Next.js project.",
    "benchmarks": "Rapid frontend prototyping benchmark standard used by millions of web developers.",
    "limitations": "Specialized for frontend JSX/React interfaces; backend API logic requires manual setup.",
    "popular": true,
    "url": "https://v0.dev",
    "citations": [
      {
        "text": "v0 by Vercel",
        "url": "https://v0.dev"
      }
    ]
  },
  {
    "name": "Lovable.dev",
    "type": "AI",
    "summary": "Full-stack autonomous AI web application builder that generates complete web apps, database schemas via Supabase, user auth, and deploys live in minutes.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2024,
    "org": "Lovable",
    "size": "N/A",
    "architecture": "Full-stack AI code synthesizer with live Supabase database & GitHub synchronization.",
    "usage": "Go to lovable.dev, type your app idea (e.g. \"Airbnb for pet boarding\"), customize components interactively, and deploy live.",
    "benchmarks": "Generates functional full-stack web applications with database persistence in under 3 minutes.",
    "limitations": "Complex enterprise microservice architectures require manual code export and expansion.",
    "popular": true,
    "url": "https://lovable.dev",
    "citations": [
      {
        "text": "Lovable.dev",
        "url": "https://lovable.dev"
      }
    ]
  },
  {
    "name": "NotebookLM",
    "type": "AI",
    "summary": "Google's personalized AI research assistant powered by Gemini 1.5 Pro, featuring Audio Overviews that turn uploaded documents into dynamic conversational podcast discussions.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2024,
    "org": "Google",
    "size": "N/A",
    "architecture": "Grounded RAG pipeline powered by Gemini 1.5 Pro long context and conversational TTS.",
    "usage": "Upload research papers, meeting notes, or PDFs at notebooklm.google.com, then click 'Audio Overview' to generate an engaging AI podcast explanation.",
    "benchmarks": "Zero hallucination rate on user source documents through strict ground-truth attribution.",
    "limitations": "Outputs strictly restricted to user uploaded source materials.",
    "popular": true,
    "url": "https://notebooklm.google.com",
    "citations": [
      {
        "text": "NotebookLM",
        "url": "https://notebooklm.google.com"
      }
    ]
  },
  {
    "name": "Devin",
    "type": "AI",
    "summary": "The first autonomous AI software engineer, equipped with its own sandboxed shell, code editor, and browser to solve end-to-end engineering tasks independently.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2024,
    "org": "Cognition AI",
    "size": "N/A",
    "architecture": "Autonomous multi-step agent architecture with sandboxed compute environment.",
    "usage": "Assign a GitHub issue or feature ticket to Devin via the Cognition dashboard or Slack integration.",
    "benchmarks": "13.86% resolved on SWE-bench at launch; over 45% on modern benchmarks.",
    "limitations": "Requires human verification for large architectural migrations and security critical code.",
    "popular": true,
    "url": "https://cognition.ai",
    "citations": [
      {
        "text": "Devin Announcement",
        "url": "https://cognition.ai/blog/introducing-devin"
      }
    ]
  },
  {
    "name": "OpenHands",
    "type": "AI",
    "summary": "Open-source autonomous AI software developer (formerly OpenDevin) that writes code, fixes bugs, and executes terminal commands across codebases.",
    "task": "AI Coding",
    "license": "MIT",
    "year": 2024,
    "org": "All Hands AI",
    "size": "N/A",
    "architecture": "Docker-based sandboxed agent environment supporting various LLM providers.",
    "usage": "docker run -it --pull=always -e SANDBOX_USER_ID=$(id -u) -v /var/run/docker.sock:/var/run/docker.sock -p 3000:3000 ghcr.io/all-hands-ai/openhands:latest",
    "benchmarks": "Top open-source agent scores on SWE-bench Verified (53%+ with frontier models).",
    "limitations": "Requires local Docker daemon setup for execution sandboxing.",
    "popular": true,
    "url": "https://github.com/All-Hands-AI/OpenHands",
    "citations": [
      {
        "text": "OpenHands Repository",
        "url": "https://github.com/All-Hands-AI/OpenHands"
      }
    ]
  },
  {
    "name": "Granola AI",
    "type": "AI",
    "summary": "AI notepad for meetings that combines human typing with customizable LLM transcript enhancement to produce clear, actionable meeting notes without intrusive bots.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2024,
    "org": "Granola",
    "size": "Desktop app",
    "architecture": "Local audio capture + Whisper transcription + fine-tuned LLM synthesis.",
    "usage": "Launch Granola on Mac during a Zoom or Google Meet call, take quick notes, and click enhance.",
    "benchmarks": "Praised by thousands of founders and executives for non-intrusive bot-free note taking.",
    "limitations": "Currently macOS native application.",
    "popular": false,
    "url": "https://www.granola.ai",
    "citations": [
      {
        "text": "Granola",
        "url": "https://www.granola.ai"
      }
    ]
  },
  {
    "name": "Superwhisper",
    "type": "AI",
    "summary": "Privacy-first local AI voice dictation app for macOS and iOS that transcribes speech into text in any application using local Whisper models with zero latency.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2024,
    "org": "Superwhisper",
    "size": "Local app",
    "architecture": "On-device Apple Silicon Metal optimized Whisper / Kokoro engine.",
    "usage": "Press global hotkey, speak naturally, and your voice is instantly transcribed and punctuated into the active cursor.",
    "benchmarks": "100% offline local privacy with near-instant transcript rendering.",
    "limitations": "macOS / iOS ecosystem focus.",
    "popular": false,
    "url": "https://superwhisper.com",
    "citations": [
      {
        "text": "Superwhisper",
        "url": "https://superwhisper.com"
      }
    ]
  },
  {
    "name": "Phind",
    "type": "AI",
    "summary": "AI search engine and pair programmer tailored specifically for developers, providing cited code snippets, documentation references, and terminal debugging.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2023,
    "org": "Phind",
    "size": "N/A",
    "architecture": "Custom 70B MoE search model paired with live web and documentation scraping index.",
    "usage": "Visit phind.com and query \"How to configure SSL in NGINX reverse proxy with Certbot in Docker\".",
    "benchmarks": "High developer satisfaction for complex programming queries and library documentation search.",
    "limitations": "Focused on technical and developer search queries.",
    "popular": true,
    "url": "https://www.phind.com",
    "citations": [
      {
        "text": "Phind",
        "url": "https://www.phind.com"
      }
    ]
  },
  {
    "name": "Krea AI",
    "type": "AI",
    "summary": "Real-time generative AI canvas and video creation tool allowing creators to generate and refine images and video with real-time brush strokes and prompt feedback.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2024,
    "org": "Krea AI",
    "size": "N/A",
    "architecture": "Real-time latent diffusion pipeline with sub-100ms screen rendering canvas.",
    "usage": "Open krea.ai, draw shapes on the left canvas, and see photorealistic 4k renders update live on the right.",
    "benchmarks": "Sub-100ms interactive visual generation loop.",
    "limitations": "Requires fast internet connection for real-time web canvas streaming.",
    "popular": true,
    "url": "https://www.krea.ai",
    "citations": [
      {
        "text": "Krea AI",
        "url": "https://www.krea.ai"
      }
    ]
  },
  {
    "name": "Glean",
    "type": "AI",
    "summary": "Enterprise AI work assistant and enterprise search platform that connects across Google Workspace, Slack, Jira, GitHub, and Microsoft 365 with role-based permissions.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2024,
    "org": "Glean Technologies",
    "size": "Enterprise Cloud",
    "architecture": "Enterprise knowledge graph with vector retrieval and semantic permission enforcement.",
    "usage": "Ask Glean: \"What is the status of project Orion and who is leading the security audit?\"",
    "benchmarks": "Enterprise standard for trusted workplace search and LLM grounding across corporate apps.",
    "limitations": "Requires enterprise corporate deployment and IT administrator configuration.",
    "popular": false,
    "url": "https://www.glean.com",
    "citations": [
      {
        "text": "Glean Enterprise Search",
        "url": "https://www.glean.com"
      }
    ]
  },
  {
    "name": "GPT-4o",
    "type": "Model",
    "summary": "OpenAI's fastest and most advanced flagship model, featuring native multimodal capabilities across text, vision, and audio in real-time.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Transformer-based, natively multimodal omni-model.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"gpt-4o\",\n  messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]\n)",
    "benchmarks": "MMLU: 88.7%, HumanEval: 90.2%",
    "limitations": "Requires subscription for high limits, proprietary API, can hallucinate facts.",
    "popular": true,
    "url": "https://openai.com/chatgpt",
    "citations": [
      {
        "text": "GPT-4o Announcement",
        "url": "https://openai.com/index/hello-gpt-4o/"
      }
    ]
  },
  {
    "name": "Claude 3.5 Sonnet",
    "type": "Model",
    "summary": "Anthropic's highly capable and exceptionally fast language model, known for advanced coding abilities, nuanced reasoning, and the interactive 'Artifacts' UI.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Anthropic",
    "size": "Unknown",
    "architecture": "Transformer-based LLM with Constitutional AI training.",
    "usage": "import anthropic\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n  model=\"claude-3-5-sonnet-20240620\",\n  max_tokens=1000,\n  messages=[{\"role\": \"user\", \"content\": \"Write a React component.\"}]\n)",
    "benchmarks": "MMLU: 88.3%, HumanEval: 92.0%",
    "limitations": "Proprietary API, strict safety filters can sometimes refuse benign prompts.",
    "popular": true,
    "url": "https://www.anthropic.com/claude",
    "citations": [
      {
        "text": "Claude 3.5 Sonnet Release",
        "url": "https://www.anthropic.com/news/claude-3-5-sonnet"
      }
    ]
  },
  {
    "name": "Claude 3 Opus",
    "type": "Model",
    "summary": "Anthropic's most powerful model for complex analysis, long documents, and nuanced reasoning tasks requiring deep comprehension.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Anthropic",
    "size": "Unknown",
    "architecture": "Transformer-based LLM with Constitutional AI and RLHF training.",
    "usage": "import anthropic\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n  model=\"claude-3-opus-20240229\",\n  max_tokens=2048,\n  messages=[{\"role\": \"user\", \"content\": \"Analyze this research paper.\"}]\n)",
    "benchmarks": "MMLU: 86.8%, GPQA: 50.4%",
    "limitations": "Slower and more expensive than Sonnet, proprietary API.",
    "popular": true,
    "url": "https://www.anthropic.com/claude",
    "citations": [
      {
        "text": "Claude 3 Model Card",
        "url": "https://www.anthropic.com/news/claude-3-family"
      }
    ]
  },
  {
    "name": "Gemini 1.5 Pro",
    "type": "Model",
    "summary": "Google's flagship multimodal model featuring a massive context window of up to 2 million tokens, allowing it to process hours of video, audio, and vast codebases.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Google DeepMind",
    "size": "Unknown",
    "architecture": "Mixture-of-Experts (MoE) transformer architecture.",
    "usage": "import google.generativeai as genai\ngenai.configure(api_key=\"YOUR_API_KEY\")\nmodel = genai.GenerativeModel('gemini-1.5-pro')\nresponse = model.generate_content(\"Summarize this 1000-page PDF.\")",
    "benchmarks": "MMLU: 85.9%, MATH: 67.7%",
    "limitations": "Proprietary API, performance can vary on extremely short-context logic puzzles.",
    "popular": true,
    "url": "https://deepmind.google/technologies/gemini/",
    "citations": [
      {
        "text": "Gemini 1.5 Pro Technical Paper",
        "url": "https://arxiv.org/abs/2403.05530"
      }
    ]
  },
  {
    "name": "Gemini 1.5 Flash",
    "type": "Model",
    "summary": "Google's lightweight, fast multimodal model optimized for high-volume tasks with a 1M token context window at lower cost.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Google DeepMind",
    "size": "Unknown",
    "architecture": "Distilled MoE transformer, optimized for speed and efficiency.",
    "usage": "import google.generativeai as genai\ngenai.configure(api_key=\"YOUR_API_KEY\")\nmodel = genai.GenerativeModel('gemini-1.5-flash')\nresponse = model.generate_content(\"Summarize this article quickly.\")",
    "benchmarks": "MMLU: 78.9%, significantly faster than Pro",
    "limitations": "Less capable than Gemini 1.5 Pro on complex reasoning tasks.",
    "popular": true,
    "url": "https://deepmind.google/technologies/gemini/flash/",
    "citations": [
      {
        "text": "Gemini 1.5 Flash Announcement",
        "url": "https://deepmind.google/technologies/gemini/flash/"
      }
    ]
  },
  {
    "name": "Llama 3 (70B)",
    "type": "Model",
    "summary": "Meta's powerful open-weights language model, offering near-proprietary performance while remaining free to download and run locally.",
    "task": "NLP",
    "license": "Meta Llama 3 License",
    "year": 2024,
    "org": "Meta AI",
    "size": "70B params",
    "architecture": "Optimized Transformer decoder architecture trained on 15T tokens.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"meta-llama/Meta-Llama-3-70B-Instruct\")\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Meta-Llama-3-70B-Instruct\")",
    "benchmarks": "MMLU: 82.0%, HumanEval: 81.7%",
    "limitations": "Requires substantial GPU VRAM to run locally, lacks native vision/audio.",
    "popular": true,
    "url": "https://llama.meta.com/",
    "citations": [
      {
        "text": "Introducing Meta Llama 3",
        "url": "https://ai.meta.com/blog/meta-llama-3/"
      }
    ]
  },
  {
    "name": "Llama 3 (8B)",
    "type": "Model",
    "summary": "Meta's compact open-weights model designed to run efficiently on consumer hardware while retaining strong instruction-following capabilities.",
    "task": "NLP",
    "license": "Meta Llama 3 License",
    "year": 2024,
    "org": "Meta AI",
    "size": "8B params",
    "architecture": "Transformer decoder with grouped query attention trained on 15T tokens.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"meta-llama/Meta-Llama-3-8B-Instruct\")\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Meta-Llama-3-8B-Instruct\")",
    "benchmarks": "MMLU: 66.6%, HumanEval: 62.2%",
    "limitations": "Less capable than larger models, struggles with complex multi-step reasoning.",
    "popular": true,
    "url": "https://llama.meta.com/",
    "citations": [
      {
        "text": "Introducing Meta Llama 3",
        "url": "https://ai.meta.com/blog/meta-llama-3/"
      }
    ]
  },
  {
    "name": "Mistral 7B",
    "type": "Model",
    "summary": "A highly efficient 7B parameter open-source model that outperforms Llama 2 13B on most benchmarks using sliding window attention and grouped query attention.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "Mistral AI",
    "size": "7B params",
    "architecture": "Transformer decoder with sliding window attention (SWA) and grouped query attention (GQA).",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"mistralai/Mistral-7B-Instruct-v0.2\")\ntokenizer = AutoTokenizer.from_pretrained(\"mistralai/Mistral-7B-Instruct-v0.2\")",
    "benchmarks": "MMLU: 60.1%, outperforms Llama 2 13B on most tasks",
    "limitations": "Smaller size limits complex reasoning, no native multimodal support.",
    "popular": true,
    "url": "https://mistral.ai/",
    "citations": [
      {
        "text": "Mistral 7B Paper",
        "url": "https://arxiv.org/abs/2310.06825"
      }
    ]
  },
  {
    "name": "Mixtral 8x7B",
    "type": "Model",
    "summary": "Mistral AI's sparse mixture-of-experts model that uses 8 expert networks but only activates 2 per token, delivering 70B-class performance at lower inference cost.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "Mistral AI",
    "size": "46.7B total params (12.9B active)",
    "architecture": "Sparse Mixture-of-Experts (SMoE) with 8 expert FFN layers, activating 2 per token.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"mistralai/Mixtral-8x7B-Instruct-v0.1\")\ntokenizer = AutoTokenizer.from_pretrained(\"mistralai/Mixtral-8x7B-Instruct-v0.1\")",
    "benchmarks": "MMLU: 70.6%, HumanEval: 40.2%",
    "limitations": "Large total parameter count, complex deployment for MoE routing.",
    "popular": true,
    "url": "https://mistral.ai/",
    "citations": [
      {
        "text": "Mixtral of Experts Paper",
        "url": "https://arxiv.org/abs/2401.04088"
      }
    ]
  },
  {
    "name": "Mistral Large",
    "type": "Model",
    "summary": "Mistral AI's flagship proprietary model, competitive with GPT-4 on reasoning, coding, and multilingual tasks.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Mistral AI",
    "size": "Unknown",
    "architecture": "Large-scale transformer with advanced instruction tuning.",
    "usage": "from mistralai.client import MistralClient\nclient = MistralClient(api_key=\"YOUR_API_KEY\")\nresponse = client.chat(\n  model=\"mistral-large-latest\",\n  messages=[{\"role\": \"user\", \"content\": \"Explain quantum entanglement.\"}]\n)",
    "benchmarks": "MMLU: 81.2%, MATH: 45.0%",
    "limitations": "Proprietary API, pay-per-use pricing.",
    "popular": true,
    "url": "https://mistral.ai/news/mistral-large/",
    "citations": [
      {
        "text": "Mistral Large Announcement",
        "url": "https://mistral.ai/news/mistral-large/"
      }
    ]
  },
  {
    "name": "Command R+",
    "type": "Model",
    "summary": "Cohere's enterprise-grade LLM optimized for RAG (Retrieval-Augmented Generation) and tool use, with strong multilingual support across 10 languages.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Cohere",
    "size": "104B params",
    "architecture": "Transformer with specialized grounded generation training for RAG workflows.",
    "usage": "import cohere\nco = cohere.Client(\"YOUR_API_KEY\")\nresponse = co.chat(\n  model=\"command-r-plus\",\n  message=\"What are the latest trends in AI?\",\n  documents=[{\"text\": \"...your documents here...\"}]\n)",
    "benchmarks": "MMLU: 75.7%, strong RAG and tool use performance",
    "limitations": "Proprietary, optimized for enterprise RAG — may underperform on general chat.",
    "popular": false,
    "url": "https://cohere.com/command",
    "citations": [
      {
        "text": "Command R+ Announcement",
        "url": "https://cohere.com/blog/command-r-plus-microsoft-azure"
      }
    ]
  },
  {
    "name": "Phi-3 Mini",
    "type": "Model",
    "summary": "Microsoft's compact 3.8B parameter model that punches far above its weight class, outperforming models 5x its size on reasoning benchmarks.",
    "task": "NLP",
    "license": "MIT",
    "year": 2024,
    "org": "Microsoft",
    "size": "3.8B params",
    "architecture": "Dense transformer decoder trained on heavily curated 'textbook-quality' data.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"microsoft/Phi-3-mini-4k-instruct\")\ntokenizer = AutoTokenizer.from_pretrained(\"microsoft/Phi-3-mini-4k-instruct\")",
    "benchmarks": "MMLU: 68.8%, outperforms Mistral 7B on many tasks",
    "limitations": "Small size limits knowledge breadth, not suitable for long-form tasks.",
    "popular": true,
    "url": "https://azure.microsoft.com/en-us/products/phi-3",
    "citations": [
      {
        "text": "Phi-3 Technical Report",
        "url": "https://arxiv.org/abs/2404.14219"
      }
    ]
  },
  {
    "name": "Qwen2 (72B)",
    "type": "Model",
    "summary": "Alibaba's powerful open-weights model series competitive with leading frontier models, with strong multilingual and coding capabilities.",
    "task": "NLP",
    "license": "Qwen License",
    "year": 2024,
    "org": "Alibaba Cloud",
    "size": "72B params",
    "architecture": "Transformer with GQA, long-context support up to 128K tokens.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"Qwen/Qwen2-72B-Instruct\")\ntokenizer = AutoTokenizer.from_pretrained(\"Qwen/Qwen2-72B-Instruct\")",
    "benchmarks": "MMLU: 84.2%, HumanEval: 86.0%",
    "limitations": "Large VRAM requirement for local inference, license restrictions for commercial use.",
    "popular": true,
    "url": "https://qwenlm.github.io/",
    "citations": [
      {
        "text": "Qwen2 Technical Report",
        "url": "https://arxiv.org/abs/2407.10671"
      }
    ]
  },
  {
    "name": "DeepSeek-V2",
    "type": "Model",
    "summary": "DeepSeek's efficient MoE model with 236B total parameters but only 21B active, offering GPT-4 class performance at dramatically lower inference cost.",
    "task": "NLP",
    "license": "DeepSeek License",
    "year": 2024,
    "org": "DeepSeek AI",
    "size": "236B total (21B active)",
    "architecture": "Multi-head Latent Attention (MLA) + DeepSeekMoE architecture.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\ntokenizer = AutoTokenizer.from_pretrained(\"deepseek-ai/DeepSeek-V2\")\nmodel = AutoModelForCausalLM.from_pretrained(\"deepseek-ai/DeepSeek-V2\", trust_remote_code=True)",
    "benchmarks": "MMLU: 78.5%, strong on math and code",
    "limitations": "Complex MoE deployment, license restricts certain commercial uses.",
    "popular": true,
    "url": "https://www.deepseek.com/",
    "citations": [
      {
        "text": "DeepSeek-V2 Paper",
        "url": "https://arxiv.org/abs/2405.04434"
      }
    ]
  },
  {
    "name": "o1 (OpenAI)",
    "type": "Model",
    "summary": "OpenAI's reasoning-focused model that 'thinks before it answers' using chain-of-thought reasoning, excelling at math, science, and coding problems.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Large-scale transformer with reinforcement learning on chain-of-thought reasoning traces.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"o1-preview\",\n  messages=[{\"role\": \"user\", \"content\": \"Solve this complex math proof.\"}]\n)",
    "benchmarks": "AIME: 83.3%, GPQA Diamond: 78.0%",
    "limitations": "Slower than GPT-4o due to extended thinking, no image output, higher cost.",
    "popular": true,
    "url": "https://openai.com/o1",
    "citations": [
      {
        "text": "OpenAI o1 System Card",
        "url": "https://openai.com/index/openai-o1-system-card/"
      }
    ]
  },
  {
    "name": "Grok-1",
    "type": "Model",
    "summary": "xAI's open-weights MoE language model, the first large model from Elon Musk's AI company, trained with a focus on real-time information and humor.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2024,
    "org": "xAI",
    "size": "314B total (86B active per token)",
    "architecture": "Sparse MoE transformer with 8 experts.",
    "usage": "# Grok-1 weights available on HuggingFace\n# Run locally with sufficient GPU cluster\nfrom transformers import AutoTokenizer\ntokenizer = AutoTokenizer.from_pretrained(\"xai-org/grok-1\")",
    "benchmarks": "MMLU: 73%, HumanEval: 63.2%",
    "limitations": "Extremely large model requiring significant compute, not production-API accessible.",
    "popular": true,
    "url": "https://x.ai/",
    "citations": [
      {
        "text": "Grok-1 Release",
        "url": "https://x.ai/blog/grok-os"
      }
    ]
  },
  {
    "name": "Llama 3.1 (405B)",
    "type": "Model",
    "summary": "Meta's flagship open-weights model and the first open model to rival top proprietary models like GPT-4o and Claude 3.5 Sonnet across general knowledge, steerability, math, tool use, and multilingual translation.",
    "task": "NLP",
    "license": "Llama 3.1 Community License",
    "year": 2024,
    "org": "Meta AI",
    "size": "405B params",
    "architecture": "Optimized transformer decoder architecture trained on 15T tokens with 128K context window.",
    "usage": "from transformers import pipeline\npipe = pipeline(\"text-generation\", model=\"meta-llama/Meta-Llama-3.1-405B-Instruct\")\npipe(\"Hello world!\")",
    "benchmarks": "MMLU: 88.6%, HumanEval: 89.0%, MATH: 73.8%",
    "limitations": "Massive hardware requirements for local inference due to 405B size.",
    "popular": true,
    "url": "https://llama.meta.com/",
    "citations": [
      {
        "text": "Llama 3.1 Announcement",
        "url": "https://ai.meta.com/blog/meta-llama-3-1/"
      }
    ]
  },
  {
    "name": "GPT-4o mini",
    "type": "Model",
    "summary": "OpenAI's most cost-efficient small model, replacing GPT-3.5 Turbo, offering significantly higher intelligence, broader multimodal capabilities, and a 128K context window at a fraction of the cost.",
    "task": "Multimodal",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Transformer-based, natively multimodal omni-model.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"gpt-4o-mini\",\n  messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]\n)",
    "benchmarks": "MMLU: 82.0%, HumanEval: 87.0%",
    "limitations": "Less capable on highly complex reasoning tasks compared to GPT-4o.",
    "popular": true,
    "url": "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/",
    "citations": [
      {
        "text": "GPT-4o mini Announcement",
        "url": "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/"
      }
    ]
  },
  {
    "name": "Claude 3 Haiku",
    "type": "Model",
    "summary": "Anthropic's fastest and most compact model for near-instant responsiveness, ideal for quick queries and high-volume tasks.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Anthropic",
    "size": "Unknown",
    "architecture": "Transformer-based LLM optimized for speed.",
    "usage": "import anthropic\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n  model=\"claude-3-haiku-20240307\",\n  max_tokens=1000,\n  messages=[{\"role\": \"user\", \"content\": \"Summarize this quickly.\"}]\n)",
    "benchmarks": "MMLU: 75.2%, HumanEval: 75.9%",
    "limitations": "Lacks the deep reasoning capabilities of Sonnet and Opus.",
    "popular": true,
    "url": "https://www.anthropic.com/claude",
    "citations": [
      {
        "text": "Claude 3 Model Card",
        "url": "https://www.anthropic.com/news/claude-3-family"
      }
    ]
  },
  {
    "name": "Gemma 2 (27B)",
    "type": "Model",
    "summary": "Google's open-weights model built from the same research and technology as the Gemini models, offering class-leading performance for its size.",
    "task": "NLP",
    "license": "Gemma License",
    "year": 2024,
    "org": "Google DeepMind",
    "size": "27B params",
    "architecture": "Transformer decoder with sliding window attention and soft-capping.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"google/gemma-2-27b-it\")\nmodel = AutoModelForCausalLM.from_pretrained(\"google/gemma-2-27b-it\")",
    "benchmarks": "MMLU: 81.5%, HumanEval: 71.5%",
    "limitations": "Commercial use permitted but subject to the Gemma license terms.",
    "popular": true,
    "url": "https://ai.google.dev/gemma",
    "citations": [
      {
        "text": "Gemma 2 Announcement",
        "url": "https://blog.google/technology/developers/google-gemma-2/"
      }
    ]
  },
  {
    "name": "Grok-2",
    "type": "Model",
    "summary": "xAI's frontier model demonstrating significant improvements in reasoning, coding, and mathematical capabilities, integrated with real-time X (Twitter) data and image generation.",
    "task": "Multimodal",
    "license": "Proprietary",
    "year": 2024,
    "org": "xAI",
    "size": "Unknown",
    "architecture": "Transformer-based multimodal LLM.",
    "usage": "# Accessed via X Premium subscription or xAI API\nimport os\nfrom openai import OpenAI\nclient = OpenAI(api_key=os.environ.get(\"XAI_API_KEY\"), base_url=\"https://api.x.ai/v1\")\nresponse = client.chat.completions.create(model=\"grok-2-latest\", messages=[{\"role\": \"user\", \"content\": \"Hi\"}])",
    "benchmarks": "Competitive with GPT-4o and Claude 3.5 Sonnet on LMSYS Chatbot Arena.",
    "limitations": "Requires subscription to X or API access, proprietary.",
    "popular": true,
    "url": "https://x.ai/",
    "citations": [
      {
        "text": "Grok-2 Announcement",
        "url": "https://x.ai/blog/grok-2"
      }
    ]
  },
  {
    "name": "GPT-4",
    "type": "Model",
    "summary": "Advanced large language model with multimodal capabilities for text and image understanding.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "OpenAI",
    "size": "Unknown (estimated 1.76T params)",
    "architecture": "Transformer-based decoder architecture with advanced reasoning capabilities.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"gpt-4\",\n  messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]\n)",
    "benchmarks": "MMLU: 86.4%, HumanEval: 67%",
    "limitations": "Can hallucinate, expensive to run, proprietary with limited access.",
    "popular": true,
    "url": "https://openai.com/gpt-4",
    "citations": [
      {
        "text": "Official GPT-4 Technical Report",
        "url": "https://openai.com/research/gpt-4"
      },
      {
        "text": "GPT-4 API Documentation",
        "url": "https://platform.openai.com/docs"
      }
    ]
  },
  {
    "name": "GPT-3.5 Turbo",
    "type": "Model",
    "summary": "OpenAI's workhorse model balancing performance and speed, widely used for chatbots and text generation at scale.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "OpenAI",
    "size": "Unknown (~175B params)",
    "architecture": "Transformer decoder fine-tuned with RLHF for instruction following.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model=\"gpt-3.5-turbo\",\n  messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]\n)",
    "benchmarks": "MMLU: 70.0%, HumanEval: 48.1%",
    "limitations": "Knowledge cutoff, prone to hallucination on niche topics.",
    "popular": true,
    "url": "https://platform.openai.com/docs/models/gpt-3-5-turbo",
    "citations": [
      {
        "text": "ChatGPT Blog Post",
        "url": "https://openai.com/blog/chatgpt"
      }
    ]
  },
  {
    "name": "GPT-3",
    "type": "Model",
    "summary": "The landmark 175B parameter autoregressive language model that demonstrated few-shot learning and ignited the modern LLM era.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2020,
    "org": "OpenAI",
    "size": "175B params",
    "architecture": "Transformer decoder with 96 attention layers.",
    "usage": "# GPT-3 is accessed via OpenAI's legacy completions API\nfrom openai import OpenAI\nclient = OpenAI()\nresponse = client.completions.create(\n  model=\"text-davinci-003\",\n  prompt=\"Translate to French: Hello, world!\",\n  max_tokens=60\n)",
    "benchmarks": "SuperGLUE: 71.8% (few-shot)",
    "limitations": "Largely superseded, expensive, no chat interface natively.",
    "popular": false,
    "url": "https://openai.com/research/language-models-are-few-shot-learners",
    "citations": [
      {
        "text": "Brown et al. (2020) - GPT-3 Paper",
        "url": "https://arxiv.org/abs/2005.14165"
      }
    ]
  },
  {
    "name": "LLaMA 2",
    "type": "Model",
    "summary": "Meta's second-generation open foundation model family (7B–70B) with a permissive commercial license, trained on 2T tokens.",
    "task": "NLP",
    "license": "Llama 2 Community License",
    "year": 2023,
    "org": "Meta AI",
    "size": "7B to 70B params",
    "architecture": "Transformer decoder with grouped query attention and RoPE embeddings.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Llama-2-70b-chat-hf\")\ntokenizer = AutoTokenizer.from_pretrained(\"meta-llama/Llama-2-70b-chat-hf\")",
    "benchmarks": "MMLU: 68.9% (70B), HumanEval: 29.9% (70B)",
    "limitations": "Weaker than Llama 3 on most tasks, 4096 max context window.",
    "popular": true,
    "url": "https://ai.meta.com/llama/",
    "citations": [
      {
        "text": "Touvron et al. (2023) - Llama 2 Paper",
        "url": "https://arxiv.org/abs/2307.09288"
      }
    ]
  },
  {
    "name": "LLaMA",
    "type": "Model",
    "summary": "Open foundation language models from 7B to 65B parameters that sparked the open-source LLM revolution.",
    "task": "NLP",
    "license": "LLaMA License (non-commercial)",
    "year": 2023,
    "org": "Meta AI",
    "size": "7B to 65B params",
    "architecture": "Transformer decoder with optimizations for efficiency.",
    "usage": "from transformers import LlamaForCausalLM, LlamaTokenizer\nmodel = LlamaForCausalLM.from_pretrained(\"meta-llama/Llama-2-7b\")\ntokenizer = LlamaTokenizer.from_pretrained(\"meta-llama/Llama-2-7b\")",
    "benchmarks": "70B model competitive with GPT-3.5 on many tasks",
    "limitations": "Restricted commercial use, requires significant compute.",
    "popular": true,
    "url": "https://ai.meta.com/llama/",
    "citations": [
      {
        "text": "Touvron et al. (2023) - LLaMA Paper",
        "url": "https://arxiv.org/abs/2302.13971"
      },
      {
        "text": "Meta AI Official LLaMA Page",
        "url": "https://ai.meta.com/llama/"
      }
    ]
  },
  {
    "name": "BERT",
    "type": "Model",
    "summary": "Bidirectional Encoder Representations from Transformers for NLP pre-training.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2018,
    "org": "Google",
    "size": "Base: 110M params, Large: 340M params",
    "architecture": "Transformer encoder with bidirectional attention, pre-trained with masked language modeling.",
    "usage": "from transformers import BertTokenizer, BertModel\ntokenizer = BertTokenizer.from_pretrained('bert-base-uncased')\nmodel = BertModel.from_pretrained('bert-base-uncased')",
    "benchmarks": "GLUE: 80.5% (base), SQuAD: 93.2 F1",
    "limitations": "Limited to 512 tokens, slower than newer models.",
    "popular": true,
    "url": "https://github.com/google-research/bert",
    "citations": [
      {
        "text": "Devlin et al. (2018) - BERT Paper",
        "url": "https://arxiv.org/abs/1810.04805"
      },
      {
        "text": "Official GitHub Repository",
        "url": "https://github.com/google-research/bert"
      }
    ]
  },
  {
    "name": "RoBERTa",
    "type": "Model",
    "summary": "A robustly optimized BERT pretraining approach that surpassed BERT by training longer with more data and removing next-sentence prediction.",
    "task": "NLP",
    "license": "MIT",
    "year": 2019,
    "org": "Facebook AI Research",
    "size": "Base: 125M params, Large: 355M params",
    "architecture": "Transformer encoder, same as BERT but with dynamic masking and longer training.",
    "usage": "from transformers import RobertaTokenizer, RobertaModel\ntokenizer = RobertaTokenizer.from_pretrained('roberta-base')\nmodel = RobertaModel.from_pretrained('roberta-base')",
    "benchmarks": "GLUE: 88.5 (large), SQuAD 2.0: 89.4 F1",
    "limitations": "Still limited to 512 tokens, encoder-only not generative.",
    "popular": false,
    "url": "https://github.com/facebookresearch/fairseq/tree/main/examples/roberta",
    "citations": [
      {
        "text": "Liu et al. (2019) - RoBERTa Paper",
        "url": "https://arxiv.org/abs/1907.11692"
      }
    ]
  },
  {
    "name": "T5",
    "type": "Model",
    "summary": "Text-To-Text Transfer Transformer — Google's unified framework that converts every NLP task into a text-to-text format.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2019,
    "org": "Google",
    "size": "Small (60M) to 11B params",
    "architecture": "Encoder-decoder transformer trained with a span-corruption pre-training objective.",
    "usage": "from transformers import T5Tokenizer, T5ForConditionalGeneration\ntokenizer = T5Tokenizer.from_pretrained(\"t5-base\")\nmodel = T5ForConditionalGeneration.from_pretrained(\"t5-base\")\ninput_ids = tokenizer(\"translate English to French: Hello world\", return_tensors=\"pt\").input_ids",
    "benchmarks": "SuperGLUE: 88.9 (11B), GLUE: 90.3 (11B)",
    "limitations": "Encoder-decoder architecture slower than decoder-only for generation tasks.",
    "popular": true,
    "url": "https://github.com/google-research/text-to-text-transfer-transformer",
    "citations": [
      {
        "text": "Raffel et al. (2019) - T5 Paper",
        "url": "https://arxiv.org/abs/1910.10683"
      }
    ]
  },
  {
    "name": "PaLM 2",
    "type": "Model",
    "summary": "Google's multilingual, reasoning-focused language model powering Bard and many Google Workspace AI features.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Google",
    "size": "Unknown (multiple sizes: Gecko, Otter, Bison, Unicorn)",
    "architecture": "Transformer trained with a compute-optimal approach across multilingual and code data.",
    "usage": "# Access via Google AI Studio or Vertex AI\nimport vertexai\nfrom vertexai.language_models import TextGenerationModel\nvertexai.init(project=\"YOUR_PROJECT\", location=\"us-central1\")\nmodel = TextGenerationModel.from_pretrained(\"text-bison@002\")\nresponse = model.predict(\"Write a poem about AI.\")",
    "benchmarks": "MMLU: 78.3%, multilingual reasoning leader in 2023",
    "limitations": "Superseded by Gemini, proprietary API.",
    "popular": false,
    "url": "https://ai.google/discover/palm2",
    "citations": [
      {
        "text": "PaLM 2 Technical Report",
        "url": "https://arxiv.org/abs/2305.10403"
      }
    ]
  },
  {
    "name": "Falcon 180B",
    "type": "Model",
    "summary": "TII's massive open-source 180B parameter model, one of the largest publicly available LLMs trained on the RefinedWeb dataset.",
    "task": "NLP",
    "license": "Falcon-180B TII License",
    "year": 2023,
    "org": "Technology Innovation Institute (TII)",
    "size": "180B params",
    "architecture": "Causal decoder-only transformer with multi-query attention.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"tiiuae/falcon-180B-chat\")\nmodel = AutoModelForCausalLM.from_pretrained(\"tiiuae/falcon-180B-chat\", trust_remote_code=True)",
    "benchmarks": "MMLU: 70.4%, competitive with PaLM 2-L",
    "limitations": "Requires massive GPU cluster, commercial use needs separate license.",
    "popular": false,
    "url": "https://falconllm.tii.ae/",
    "citations": [
      {
        "text": "Falcon 180B Release",
        "url": "https://huggingface.co/tiiuae/falcon-180B"
      }
    ]
  },
  {
    "name": "Vicuna-13B",
    "type": "Model",
    "summary": "A fine-tuned LLaMA model trained on ShareGPT conversations, achieving 90% of ChatGPT quality according to GPT-4 evaluations.",
    "task": "NLP",
    "license": "Non-commercial (based on LLaMA license)",
    "year": 2023,
    "org": "LMSYS",
    "size": "13B params",
    "architecture": "LLaMA decoder fine-tuned on ~70K user-shared ChatGPT conversations.",
    "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"lmsys/vicuna-13b-v1.5\")\ntokenizer = AutoTokenizer.from_pretrained(\"lmsys/vicuna-13b-v1.5\")",
    "benchmarks": "GPT-4 judged 90% of ChatGPT quality on open questions",
    "limitations": "Non-commercial, hallucinates more than proprietary models.",
    "popular": false,
    "url": "https://lmsys.org/blog/2023-03-30-vicuna/",
    "citations": [
      {
        "text": "Vicuna Blog Post",
        "url": "https://lmsys.org/blog/2023-03-30-vicuna/"
      }
    ]
  },
  {
    "name": "Alpaca",
    "type": "Model",
    "summary": "Stanford's instruction-tuned model based on LLaMA 7B, fine-tuned for ~$600 using Self-Instruct data generated from GPT-3.5.",
    "task": "NLP",
    "license": "Non-commercial (CC BY NC 4.0)",
    "year": 2023,
    "org": "Stanford CRFM",
    "size": "7B params",
    "architecture": "LLaMA fine-tuned on 52K instruction-following examples from GPT-3.5.",
    "usage": "# Weights available on HuggingFace\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained(\"tatsu-lab/alpaca-7b-wdiff\")\ntokenizer = AutoTokenizer.from_pretrained(\"tatsu-lab/alpaca-7b-wdiff\")",
    "benchmarks": "Comparable to GPT-3.5 text-davinci-003 in human evaluation",
    "limitations": "Non-commercial license, now largely superseded by better open models.",
    "popular": false,
    "url": "https://crfm.stanford.edu/2023/03/13/alpaca.html",
    "citations": [
      {
        "text": "Alpaca: A Strong Open-Source LLM",
        "url": "https://crfm.stanford.edu/2023/03/13/alpaca.html"
      }
    ]
  },
  {
    "name": "Midjourney v6",
    "type": "Model",
    "summary": "A highly advanced text-to-image AI capable of generating photorealistic imagery, complex compositions, and readable text within images.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2023,
    "org": "Midjourney, Inc.",
    "size": "Unknown",
    "architecture": "Latent diffusion model.",
    "usage": "# Midjourney does not offer an official public API.\n# Usage is primarily through their Discord bot or web interface.\n/imagine prompt: A futuristic cyberpunk city in the rain, highly detailed --v 6.0",
    "benchmarks": "N/A (Subjective visual quality leader)",
    "limitations": "No official API, requires Discord/web interface, paid subscription only.",
    "popular": true,
    "url": "https://www.midjourney.com/",
    "citations": [
      {
        "text": "Midjourney Alpha",
        "url": "https://www.midjourney.com/"
      }
    ]
  },
  {
    "name": "Stable Diffusion",
    "type": "Model",
    "summary": "Open-source latent diffusion model for high-quality text-to-image generation.",
    "task": "Computer Vision",
    "license": "CreativeML Open RAIL-M",
    "year": 2022,
    "org": "Stability AI",
    "size": "890M params",
    "architecture": "Latent diffusion model with CLIP text encoder and U-Net denoising network.",
    "usage": "from diffusers import StableDiffusionPipeline\npipe = StableDiffusionPipeline.from_pretrained(\"stabilityai/stable-diffusion-2\")\nimage = pipe(\"a photo of an astronaut on mars\").images[0]",
    "benchmarks": "FID score competitive with DALL-E 2",
    "limitations": "Can produce biased outputs, requires GPU for reasonable speed.",
    "popular": true,
    "url": "https://stability.ai/stable-diffusion",
    "citations": [
      {
        "text": "Rombach et al. (2022) - Latent Diffusion Paper",
        "url": "https://arxiv.org/abs/2112.10752"
      },
      {
        "text": "Stability AI Official Site",
        "url": "https://stability.ai"
      }
    ]
  },
  {
    "name": "Stable Diffusion XL (SDXL)",
    "type": "Model",
    "summary": "An improved latent diffusion model with a larger UNet backbone and a refiner model, producing higher-resolution and more detailed images than SD 1.5/2.x.",
    "task": "Computer Vision",
    "license": "CreativeML Open RAIL++-M",
    "year": 2023,
    "org": "Stability AI",
    "size": "3.5B params (base + refiner)",
    "architecture": "Dual text encoders (CLIP ViT-L + OpenCLIP ViT-bigG) with larger UNet backbone.",
    "usage": "from diffusers import DiffusionPipeline\npipe = DiffusionPipeline.from_pretrained(\"stabilityai/stable-diffusion-xl-base-1.0\")\nimage = pipe(prompt=\"A majestic lion at sunset, 8K\").images[0]",
    "benchmarks": "Significantly higher FID than SD 2.1, preferred in human evaluation",
    "limitations": "Higher VRAM requirement (~12GB), slower than SD 1.5.",
    "popular": true,
    "url": "https://stability.ai/stable-image",
    "citations": [
      {
        "text": "SDXL Paper",
        "url": "https://arxiv.org/abs/2307.01952"
      }
    ]
  },
  {
    "name": "DALL-E 3",
    "type": "Model",
    "summary": "OpenAI's third-generation text-to-image model with dramatically improved prompt adherence, integrated directly into ChatGPT.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2023,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Diffusion model with improved text conditioning via a recaptioning technique.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.images.generate(\n  model=\"dall-e-3\",\n  prompt=\"A cozy cabin in a snowy forest at night, cinematic lighting\",\n  size=\"1024x1024\",\n  quality=\"hd\"\n)",
    "benchmarks": "Human preference significantly higher than DALL-E 2, SD, and Midjourney v5",
    "limitations": "Proprietary, no local inference, usage policy restrictions.",
    "popular": true,
    "url": "https://openai.com/dall-e-3",
    "citations": [
      {
        "text": "DALL-E 3 Technical Report",
        "url": "https://openai.com/research/dall-e-3"
      }
    ]
  },
  {
    "name": "DALL-E 2",
    "type": "Model",
    "summary": "OpenAI's second-generation image model introducing inpainting, outpainting, and variations from text and image inputs.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2022,
    "org": "OpenAI",
    "size": "Unknown (3.5B params)",
    "architecture": "CLIP-guided hierarchical diffusion model with GLIDE as prior.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.images.generate(\n  model=\"dall-e-2\",\n  prompt=\"A surrealist painting of a robot reading a book\",\n  n=1,\n  size=\"1024x1024\"\n)",
    "benchmarks": "FID: 10.39 on COCO",
    "limitations": "Superseded by DALL-E 3, limited prompt comprehension vs. newer models.",
    "popular": false,
    "url": "https://openai.com/dall-e-2",
    "citations": [
      {
        "text": "Hierarchical Text-Conditional Image Generation Paper",
        "url": "https://arxiv.org/abs/2204.06125"
      }
    ]
  },
  {
    "name": "CLIP",
    "type": "Model",
    "summary": "Contrastive Language-Image Pre-training for zero-shot image classification.",
    "task": "Computer Vision",
    "license": "MIT",
    "year": 2021,
    "org": "OpenAI",
    "size": "ViT-L/14: 428M params",
    "architecture": "Dual encoder with vision transformer and text transformer trained contrastively.",
    "usage": "import clip\nmodel, preprocess = clip.load(\"ViT-B/32\")\nimage = preprocess(image).unsqueeze(0)\ntext = clip.tokenize([\"a cat\", \"a dog\"])",
    "benchmarks": "Zero-shot ImageNet: 76.2% top-1",
    "limitations": "Struggles with fine-grained classification, abstract concepts.",
    "popular": true,
    "url": "https://github.com/openai/CLIP",
    "citations": [
      {
        "text": "Radford et al. (2021) - CLIP Paper",
        "url": "https://arxiv.org/abs/2103.00020"
      },
      {
        "text": "Official CLIP Repository",
        "url": "https://github.com/openai/CLIP"
      }
    ]
  },
  {
    "name": "SAM (Segment Anything Model)",
    "type": "Model",
    "summary": "Meta's foundation model for image segmentation that can segment any object in any image with a single click, point, or text prompt.",
    "task": "Computer Vision",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "Meta AI",
    "size": "ViT-H: 636M params",
    "architecture": "Vision Transformer image encoder + prompt encoder + mask decoder.",
    "usage": "from segment_anything import sam_model_registry, SamPredictor\nsam = sam_model_registry[\"vit_h\"](checkpoint=\"sam_vit_h.pth\")\npredictor = SamPredictor(sam)\npredictor.set_image(image)\nmasks, scores, logits = predictor.predict(point_coords=input_point, point_labels=input_label)",
    "benchmarks": "Zero-shot COCO AP: 46.5% (SAM ViT-H)",
    "limitations": "Does not track objects across frames, not designed for semantic labeling.",
    "popular": true,
    "url": "https://segment-anything.com/",
    "citations": [
      {
        "text": "Kirillov et al. (2023) - SAM Paper",
        "url": "https://arxiv.org/abs/2304.02643"
      }
    ]
  },
  {
    "name": "Whisper",
    "type": "Model",
    "summary": "OpenAI's robust automatic speech recognition (ASR) model trained on 680K hours of multilingual and multitask supervised web data.",
    "task": "Audio",
    "license": "MIT",
    "year": 2022,
    "org": "OpenAI",
    "size": "Large-v3: 1.55B params",
    "architecture": "Encoder-decoder transformer operating on log-Mel spectrograms.",
    "usage": "import whisper\nmodel = whisper.load_model(\"large-v3\")\nresult = model.transcribe(\"audio.mp3\")\nprint(result[\"text\"])",
    "benchmarks": "WER competitive with commercial ASR on LibriSpeech",
    "limitations": "Real-time use requires optimization, struggles with heavy accents and rare languages.",
    "popular": true,
    "url": "https://openai.com/research/whisper",
    "citations": [
      {
        "text": "Radford et al. (2022) - Whisper Paper",
        "url": "https://arxiv.org/abs/2212.04356"
      }
    ]
  },
  {
    "name": "ViT (Vision Transformer)",
    "type": "Model",
    "summary": "The original paper demonstrating that pure transformer architecture, without convolutional layers, achieves state-of-the-art results on image classification.",
    "task": "Computer Vision",
    "license": "Apache-2.0",
    "year": 2020,
    "org": "Google Brain",
    "size": "ViT-L/16: 307M params",
    "architecture": "Pure transformer applied to sequences of image patches.",
    "usage": "from transformers import ViTImageProcessor, ViTForImageClassification\nfrom PIL import Image\nprocessor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')\nmodel = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')",
    "benchmarks": "ImageNet top-1: 88.55% (ViT-L/16)",
    "limitations": "Requires large datasets to train from scratch, less data-efficient than CNNs.",
    "popular": true,
    "url": "https://github.com/google-research/vision_transformer",
    "citations": [
      {
        "text": "Dosovitskiy et al. (2020) - ViT Paper",
        "url": "https://arxiv.org/abs/2010.11929"
      }
    ]
  },
  {
    "name": "Sora",
    "type": "Model",
    "summary": "OpenAI's text-to-video model capable of generating high-quality, minute-long video clips from text descriptions with impressive temporal consistency.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Diffusion transformer (DiT) operating on spacetime patches of video.",
    "usage": "# Sora is accessible via ChatGPT Plus/Pro or the OpenAI API\n# API access for developers was opened in late 2024\nfrom openai import OpenAI\nclient = OpenAI()\n# See official Sora docs for current API usage",
    "benchmarks": "N/A — subjective quality; significant leap in video coherence",
    "limitations": "Limited public API access, expensive, struggles with physics simulation.",
    "popular": true,
    "url": "https://openai.com/sora",
    "citations": [
      {
        "text": "Sora Technical Report",
        "url": "https://openai.com/research/video-generation-models-as-world-simulators"
      }
    ]
  },
  {
    "name": "ResNet",
    "type": "Model",
    "summary": "The residual neural network that introduced skip connections, enabling training of very deep networks (100+ layers) and winning ImageNet 2015.",
    "task": "Computer Vision",
    "license": "MIT",
    "year": 2015,
    "org": "Microsoft Research",
    "size": "ResNet-50: 25M params",
    "architecture": "CNN with residual (skip) connections to enable very deep network training.",
    "usage": "import torchvision.models as models\nmodel = models.resnet50(pretrained=True)\nmodel.eval()",
    "benchmarks": "ImageNet top-5 error: 3.57% (ensemble)",
    "limitations": "Largely superseded by ViT-based models for top benchmarks.",
    "popular": true,
    "url": "https://arxiv.org/abs/1512.03385",
    "citations": [
      {
        "text": "He et al. (2015) - Deep Residual Learning Paper",
        "url": "https://arxiv.org/abs/1512.03385"
      }
    ]
  },
  {
    "name": "YOLOv8",
    "type": "Model",
    "summary": "The latest iteration of the You Only Look Once real-time object detection framework, supporting detection, segmentation, pose estimation, and classification.",
    "task": "Computer Vision",
    "license": "AGPL-3.0",
    "year": 2023,
    "org": "Ultralytics",
    "size": "Nano: 3.2M params to Extra-Large: 68.2M params",
    "architecture": "Single-stage detector with an anchor-free head and a CSPDarknet backbone.",
    "usage": "from ultralytics import YOLO\nmodel = YOLO(\"yolov8n.pt\")\nresults = model(\"https://ultralytics.com/images/bus.jpg\")\nresults[0].show()",
    "benchmarks": "COCO mAP: 53.9% (YOLOv8x)",
    "limitations": "AGPL license may restrict commercial use without purchase.",
    "popular": true,
    "url": "https://github.com/ultralytics/ultralytics",
    "citations": [
      {
        "text": "Ultralytics YOLOv8 Docs",
        "url": "https://docs.ultralytics.com/"
      }
    ]
  },
  {
    "name": "Flux.1",
    "type": "Model",
    "summary": "Black Forest Labs' state-of-the-art suite of text-to-image models (Pro, Dev, Schnell) pushing the boundaries of prompt adherence, visual quality, and image detail.",
    "task": "Computer Vision",
    "license": "Various (Pro: Proprietary, Dev: Non-commercial, Schnell: Apache 2.0)",
    "year": 2024,
    "org": "Black Forest Labs",
    "size": "12B params",
    "architecture": "Hybrid architecture of multimodal and parallel diffusion transformer blocks.",
    "usage": "# Via API or locally for open variants\nfrom diffusers import FluxPipeline\nimport torch\npipe = FluxPipeline.from_pretrained(\"black-forest-labs/FLUX.1-schnell\", torch_dtype=torch.bfloat16)\nimage = pipe(\"A cat holding a sign that says 'Hello World'\").images[0]",
    "benchmarks": "State-of-the-art ELO scores surpassing Midjourney v6 and DALL-E 3 on prompt adherence.",
    "limitations": "High VRAM requirements for local inference of the full 12B model.",
    "popular": true,
    "url": "https://blackforestlabs.ai/",
    "citations": [
      {
        "text": "FLUX.1 Announcement",
        "url": "https://blackforestlabs.ai/announcing-black-forest-labs/"
      }
    ]
  },
  {
    "name": "Runway Gen-3 Alpha",
    "type": "Model",
    "summary": "Runway's advanced video generation model capable of highly photorealistic, consistent, and controllable video creation from text, images, or video inputs.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2024,
    "org": "Runway",
    "size": "Unknown",
    "architecture": "Large-scale multimodal diffusion transformer trained jointly on video and images.",
    "usage": "# Accessed via Runway web interface or API\n# Provide a descriptive prompt to generate high-fidelity video clips.",
    "benchmarks": "Major improvements in temporal consistency and photorealism over Gen-2.",
    "limitations": "Proprietary, paid service, max generation length limitations.",
    "popular": true,
    "url": "https://runwayml.com/",
    "citations": [
      {
        "text": "Gen-3 Alpha Release",
        "url": "https://runwayml.com/research/introducing-gen-3-alpha"
      }
    ]
  },
  {
    "name": "MusicGen",
    "type": "Model",
    "summary": "Meta's controllable text-to-music model that generates high-quality music from text descriptions or melody conditioning.",
    "task": "Audio",
    "license": "CC BY-NC 4.0",
    "year": 2023,
    "org": "Meta AI",
    "size": "300M to 3.3B params",
    "architecture": "Transformer-based auto-regressive language model operating on EnCodec audio tokens.",
    "usage": "from audiocraft.models import MusicGen\nmodel = MusicGen.get_pretrained('facebook/musicgen-large')\nmodel.set_generation_params(duration=8)\nwav = model.generate([\"An upbeat jazz piano with drums\"])",
    "benchmarks": "FAD: 4.93 (large model), Fréchet Audio Distance competitive with MusicLM",
    "limitations": "Non-commercial license, 30-second max duration natively.",
    "popular": false,
    "url": "https://github.com/facebookresearch/audiocraft",
    "citations": [
      {
        "text": "Copet et al. (2023) - MusicGen Paper",
        "url": "https://arxiv.org/abs/2306.05284"
      }
    ]
  },
  {
    "name": "LLaVA",
    "type": "Model",
    "summary": "Large Language-and-Vision Assistant — an open-source multimodal model that combines a visual encoder with an LLM for general-purpose visual question answering.",
    "task": "Multimodal",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "University of Wisconsin-Madison & Microsoft",
    "size": "7B to 34B params",
    "architecture": "CLIP visual encoder connected to a Vicuna/Mistral LLM via a linear projection layer.",
    "usage": "from transformers import LlavaNextProcessor, LlavaNextForConditionalGeneration\nprocessor = LlavaNextProcessor.from_pretrained(\"llava-hf/llava-v1.6-mistral-7b-hf\")\nmodel = LlavaNextForConditionalGeneration.from_pretrained(\"llava-hf/llava-v1.6-mistral-7b-hf\")",
    "benchmarks": "MMBench: 76.3% (LLaVA-1.6 34B), ScienceQA: 90.92%",
    "limitations": "Vision understanding still behind GPT-4V on complex visual tasks.",
    "popular": true,
    "url": "https://llava-vl.github.io/",
    "citations": [
      {
        "text": "LLaVA Paper",
        "url": "https://arxiv.org/abs/2304.08485"
      }
    ]
  },
  {
    "name": "Suno v3.5",
    "type": "Model",
    "summary": "State-of-the-art AI music generation model capable of creating full, radio-quality songs with vocals and instrumentation from simple text prompts.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2024,
    "org": "Suno",
    "size": "Unknown",
    "architecture": "Proprietary audio generation architecture.",
    "usage": "# Accessed via Suno web platform or API\n# Prompt: \"An upbeat pop song about coding late at night\"",
    "benchmarks": "High subjective quality for coherent musical structure and intelligible vocals.",
    "limitations": "Proprietary, max song length limits, potential copyright concerns regarding training data.",
    "popular": true,
    "url": "https://suno.com/",
    "citations": [
      {
        "text": "Suno v3.5 Announcement",
        "url": "https://suno.com/blog/v3-5"
      }
    ]
  },
  {
    "name": "ElevenLabs",
    "type": "Model",
    "summary": "Leading AI voice generation platform offering extremely natural, emotive text-to-speech, voice cloning, and dubbing across multiple languages.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2022,
    "org": "ElevenLabs",
    "size": "Unknown",
    "architecture": "Proprietary deep learning model for speech synthesis.",
    "usage": "import requests\nurl = \"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}\"\nheaders = {\"xi-api-key\": \"YOUR_API_KEY\", \"Content-Type\": \"application/json\"}\ndata = {\"text\": \"Hello, world!\", \"model_id\": \"eleven_multilingual_v2\"}\nresponse = requests.post(url, json=data, headers=headers)",
    "benchmarks": "Industry-leading MOS (Mean Opinion Score) for voice naturalness.",
    "limitations": "Proprietary, paid API for higher usage or commercial rights.",
    "popular": true,
    "url": "https://elevenlabs.io/",
    "citations": [
      {
        "text": "ElevenLabs Official Site",
        "url": "https://elevenlabs.io/"
      }
    ]
  },
  {
    "name": "Llama 3.2 (90B Vision)",
    "type": "Model",
    "summary": "Meta's open-weights multimodal model, supporting high-resolution image reasoning alongside top-tier text capabilities.",
    "task": "Multimodal",
    "license": "Llama 3.2 Community License",
    "year": 2024,
    "org": "Meta AI",
    "size": "90B params",
    "architecture": "Transformer decoder integrated with vision encoder via cross-attention.",
    "usage": "from transformers import MllamaForConditionalGeneration, AutoProcessor\nmodel = MllamaForConditionalGeneration.from_pretrained(\"meta-llama/Llama-3.2-90B-Vision-Instruct\")\nprocessor = AutoProcessor.from_pretrained(\"meta-llama/Llama-3.2-90B-Vision-Instruct\")",
    "benchmarks": "Highly competitive with closed models on MMMU and MathVista.",
    "limitations": "Significant hardware required for local inference.",
    "popular": true,
    "url": "https://llama.meta.com/",
    "citations": [
      {
        "text": "Llama 3.2 Announcement",
        "url": "https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/"
      }
    ]
  },
  {
    "name": "Codex",
    "type": "Model",
    "summary": "OpenAI's code-specialized GPT model that powers GitHub Copilot, fine-tuned on billions of lines of public code.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2021,
    "org": "OpenAI",
    "size": "12B params",
    "architecture": "GPT-3 fine-tuned on 159GB of GitHub code across 54 programming languages.",
    "usage": "# Codex is accessed via the OpenAI Completions API (deprecated in favor of GPT-4)\nfrom openai import OpenAI\nclient = OpenAI()\nresponse = client.completions.create(\n  model=\"code-davinci-002\",\n  prompt=\"# Python function to sort a list\\ndef sort_list(\",\n  max_tokens=100\n)",
    "benchmarks": "HumanEval: 72% pass@100",
    "limitations": "Deprecated — succeeded by GPT-4, can generate insecure code.",
    "popular": true,
    "url": "https://openai.com/blog/openai-codex",
    "citations": [
      {
        "text": "Chen et al. (2021) - Codex Paper",
        "url": "https://arxiv.org/abs/2107.03374"
      }
    ]
  },
  {
    "name": "Code Llama",
    "type": "Model",
    "summary": "Meta's family of open-source code-specialized models (7B–70B) built on Llama 2, supporting code generation, infilling, and instruction-following for 100+ programming languages.",
    "task": "NLP",
    "license": "Llama 2 Community License",
    "year": 2023,
    "org": "Meta AI",
    "size": "7B to 70B params",
    "architecture": "Llama 2 fine-tuned on 500B code tokens, with infilling and long-context capability.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"meta-llama/CodeLlama-34b-Instruct-hf\")\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/CodeLlama-34b-Instruct-hf\")",
    "benchmarks": "HumanEval: 53.7% (34B), pass@1",
    "limitations": "Commercial use constraints from Llama 2 license.",
    "popular": true,
    "url": "https://ai.meta.com/blog/code-llama-large-language-model-coding/",
    "citations": [
      {
        "text": "Code Llama Paper",
        "url": "https://arxiv.org/abs/2308.12950"
      }
    ]
  },
  {
    "name": "StarCoder2",
    "type": "Model",
    "summary": "BigCode's open state-of-the-art code model trained on 619 programming languages with permissive licensing, supporting infilling and 16K context.",
    "task": "NLP",
    "license": "BigCode OpenRAIL-M v1",
    "year": 2024,
    "org": "BigCode / HuggingFace",
    "size": "3B to 15B params",
    "architecture": "Transformer decoder with multi-query attention and Fill-in-the-Middle (FIM) training.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"bigcode/starcoder2-15b\")\nmodel = AutoModelForCausalLM.from_pretrained(\"bigcode/starcoder2-15b\")",
    "benchmarks": "HumanEval: 46.3% (15B pass@1), best open model at time of release",
    "limitations": "Not an instruction-tuned chat model by default, requires fine-tuning for dialogue.",
    "popular": true,
    "url": "https://github.com/bigcode-project/starcoder2",
    "citations": [
      {
        "text": "StarCoder2 Paper",
        "url": "https://arxiv.org/abs/2402.19173"
      }
    ]
  },
  {
    "name": "DeepSeek-Coder",
    "type": "Model",
    "summary": "DeepSeek's top-performing open-source code model series (1.3B–33B) that outperforms GPT-3.5 Turbo on many coding benchmarks.",
    "task": "NLP",
    "license": "DeepSeek License",
    "year": 2023,
    "org": "DeepSeek AI",
    "size": "1.3B to 33B params",
    "architecture": "Transformer decoder trained on 2T tokens across 87 programming languages.",
    "usage": "from transformers import AutoTokenizer, AutoModelForCausalLM\ntokenizer = AutoTokenizer.from_pretrained(\"deepseek-ai/deepseek-coder-33b-instruct\")\nmodel = AutoModelForCausalLM.from_pretrained(\"deepseek-ai/deepseek-coder-33b-instruct\")",
    "benchmarks": "HumanEval: 79.3% (33B), outperforms GPT-3.5 Turbo",
    "limitations": "License restricts certain commercial applications.",
    "popular": true,
    "url": "https://github.com/deepseek-ai/DeepSeek-Coder",
    "citations": [
      {
        "text": "DeepSeek-Coder Paper",
        "url": "https://arxiv.org/abs/2401.14196"
      }
    ]
  },
  {
    "name": "text-embedding-3-large",
    "type": "Model",
    "summary": "OpenAI's most capable text embedding model, with improved multilingual performance and flexible dimensionality reduction.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "OpenAI",
    "size": "Unknown",
    "architecture": "Encoder-only transformer producing dense vector representations.",
    "usage": "from openai import OpenAI\nclient = OpenAI()\nresponse = client.embeddings.create(\n  input=\"Your text string goes here\",\n  model=\"text-embedding-3-large\"\n)\nembedding = response.data[0].embedding",
    "benchmarks": "MTEB: 64.6% average across 56 tasks",
    "limitations": "Proprietary, pay-per-use, no local inference.",
    "popular": true,
    "url": "https://platform.openai.com/docs/guides/embeddings",
    "citations": [
      {
        "text": "New Embedding Models Announcement",
        "url": "https://openai.com/blog/new-embedding-models-and-api-updates"
      }
    ]
  },
  {
    "name": "E5-Mistral-7B",
    "type": "Model",
    "summary": "Microsoft's state-of-the-art text embedding model based on Mistral 7B, achieving top MTEB scores for retrieval and semantic search tasks.",
    "task": "NLP",
    "license": "MIT",
    "year": 2024,
    "org": "Microsoft",
    "size": "7B params",
    "architecture": "Mistral 7B decoder fine-tuned with contrastive learning for embedding tasks.",
    "usage": "from sentence_transformers import SentenceTransformer\nmodel = SentenceTransformer(\"intfloat/e5-mistral-7b-instruct\")\nembeddings = model.encode([\"Hello world\", \"Bonjour le monde\"])",
    "benchmarks": "MTEB: 66.6% average (top open model at release)",
    "limitations": "7B params is large for an embedding model, slower than lighter alternatives.",
    "popular": true,
    "url": "https://arxiv.org/abs/2401.00368",
    "citations": [
      {
        "text": "E5-Mistral Paper",
        "url": "https://arxiv.org/abs/2401.00368"
      }
    ]
  },
  {
    "name": "PyTorch",
    "type": "Framework",
    "summary": "Open-source machine learning framework with dynamic computation graphs.",
    "task": "MLOps",
    "license": "BSD-3-Clause",
    "year": 2016,
    "org": "Meta AI",
    "size": "N/A",
    "architecture": "Python-first framework with automatic differentiation and GPU acceleration.",
    "usage": "import torch\nimport torch.nn as nn\nmodel = nn.Sequential(\n  nn.Linear(10, 20),\n  nn.ReLU(),\n  nn.Linear(20, 1)\n)",
    "benchmarks": "Most popular framework for research (60%+ papers)",
    "limitations": "More verbose than high-level frameworks, deployment can be complex.",
    "popular": true,
    "url": "https://pytorch.org",
    "citations": [
      {
        "text": "PyTorch Official Documentation",
        "url": "https://pytorch.org/docs"
      },
      {
        "text": "GitHub Repository",
        "url": "https://github.com/pytorch/pytorch"
      }
    ]
  },
  {
    "name": "TensorFlow",
    "type": "Framework",
    "summary": "Google's end-to-end open-source ML platform, widely used in production for its robust serving infrastructure and mobile deployment via TensorFlow Lite.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2015,
    "org": "Google Brain",
    "size": "N/A",
    "architecture": "Graph-based computation framework with eager execution support, Keras high-level API.",
    "usage": "import tensorflow as tf\nmodel = tf.keras.Sequential([\n  tf.keras.layers.Dense(64, activation='relu'),\n  tf.keras.layers.Dense(10, activation='softmax')\n])\nmodel.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])",
    "benchmarks": "Dominant framework for production ML deployments",
    "limitations": "More complex debugging than PyTorch, less dominant in research community.",
    "popular": true,
    "url": "https://www.tensorflow.org",
    "citations": [
      {
        "text": "TensorFlow Official Site",
        "url": "https://www.tensorflow.org"
      },
      {
        "text": "GitHub Repository",
        "url": "https://github.com/tensorflow/tensorflow"
      }
    ]
  },
  {
    "name": "JAX",
    "type": "Framework",
    "summary": "Google's high-performance numerical computing library combining Autograd and XLA, enabling GPU/TPU-accelerated ML research with functional transformations.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2018,
    "org": "Google DeepMind",
    "size": "N/A",
    "architecture": "NumPy-compatible API with JIT compilation, vectorization (vmap), and automatic differentiation (grad).",
    "usage": "import jax\nimport jax.numpy as jnp\n\n@jax.jit\ndef predict(params, x):\n  return jnp.dot(x, params['w']) + params['b']\n\ngrad_fn = jax.grad(lambda params, x, y: jnp.mean((predict(params, x) - y)**2))",
    "benchmarks": "Powers many state-of-the-art research papers at Google DeepMind",
    "limitations": "Steeper learning curve, functional style requires adapting existing code.",
    "popular": true,
    "url": "https://github.com/google/jax",
    "citations": [
      {
        "text": "JAX GitHub Repository",
        "url": "https://github.com/google/jax"
      }
    ]
  },
  {
    "name": "LangChain",
    "type": "Framework",
    "summary": "A popular framework for building LLM-powered applications with chains, agents, memory, and tool integrations.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2022,
    "org": "LangChain AI",
    "size": "N/A",
    "architecture": "Modular Python/JS library with abstractions for chains, agents, retrievers, and memory.",
    "usage": "from langchain_openai import ChatOpenAI\nfrom langchain_core.messages import HumanMessage\n\nmodel = ChatOpenAI(model=\"gpt-4o\")\nresponse = model.invoke([HumanMessage(content=\"Tell me a joke.\")])",
    "benchmarks": "Most starred LLM framework on GitHub (85K+ stars)",
    "limitations": "Rapidly evolving API, abstractions can be opaque, sometimes overengineered for simple tasks.",
    "popular": true,
    "url": "https://www.langchain.com/",
    "citations": [
      {
        "text": "LangChain Documentation",
        "url": "https://python.langchain.com/docs/get_started/introduction"
      }
    ]
  },
  {
    "name": "LlamaIndex",
    "type": "Framework",
    "summary": "A data framework for LLM applications focused on ingesting, structuring, and accessing private or domain-specific data for RAG applications.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2022,
    "org": "LlamaIndex",
    "size": "N/A",
    "architecture": "Data connectors + indexing strategies + query engines for RAG pipelines.",
    "usage": "from llama_index.core import VectorStoreIndex, SimpleDirectoryReader\ndocuments = SimpleDirectoryReader(\"data\").load_data()\nindex = VectorStoreIndex.from_documents(documents)\nquery_engine = index.as_query_engine()\nresponse = query_engine.query(\"What did the author do growing up?\")",
    "benchmarks": "Leading framework for RAG-based applications",
    "limitations": "Can be complex for advanced configurations, performance depends on vector store choice.",
    "popular": true,
    "url": "https://www.llamaindex.ai/",
    "citations": [
      {
        "text": "LlamaIndex Documentation",
        "url": "https://docs.llamaindex.ai/"
      }
    ]
  },
  {
    "name": "Scikit-learn",
    "type": "Framework",
    "summary": "The go-to Python library for classical machine learning with a consistent, easy-to-use API for classification, regression, clustering, and preprocessing.",
    "task": "MLOps",
    "license": "BSD-3-Clause",
    "year": 2007,
    "org": "Community / INRIA",
    "size": "N/A",
    "architecture": "Python library built on NumPy, SciPy, and Matplotlib with estimator API pattern.",
    "usage": "from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nclf = RandomForestClassifier(n_estimators=100)\nclf.fit(X_train, y_train)\nprint(clf.score(X_test, y_test))",
    "benchmarks": "N/A — foundational library, not benchmarked as a model",
    "limitations": "Not designed for deep learning or GPU-accelerated large-scale training.",
    "popular": true,
    "url": "https://scikit-learn.org",
    "citations": [
      {
        "text": "Pedregosa et al. (2011) - Scikit-learn Paper",
        "url": "https://arxiv.org/abs/1201.0490"
      }
    ]
  },
  {
    "name": "Keras",
    "type": "Framework",
    "summary": "A high-level deep learning API that runs on top of TensorFlow, JAX, or PyTorch, designed for fast experimentation with a human-centric design philosophy.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2015,
    "org": "Google",
    "size": "N/A",
    "architecture": "Multi-backend deep learning API (TF/JAX/PyTorch) with layer, model, and optimizer abstractions.",
    "usage": "import keras\nmodel = keras.Sequential([\n  keras.layers.Dense(64, activation='relu'),\n  keras.layers.Dense(1, activation='sigmoid')\n])\nmodel.compile(optimizer='adam', loss='binary_crossentropy')\nmodel.fit(x_train, y_train, epochs=10)",
    "benchmarks": "N/A — high-level API; backend-dependent performance",
    "limitations": "Less flexibility than raw PyTorch for custom training loops.",
    "popular": true,
    "url": "https://keras.io",
    "citations": [
      {
        "text": "Keras Official Documentation",
        "url": "https://keras.io/guides/"
      }
    ]
  },
  {
    "name": "Ollama",
    "type": "Framework",
    "summary": "A tool for running large language models locally on your Mac, Linux, or Windows machine with a simple CLI and REST API.",
    "task": "MLOps",
    "license": "MIT",
    "year": 2023,
    "org": "Ollama",
    "size": "N/A",
    "architecture": "Go-based server wrapping llama.cpp inference backend with a Docker-like model management CLI.",
    "usage": "# Install and run from terminal\n$ ollama pull llama3\n$ ollama run llama3\n\n# Or use the REST API\nimport requests\nresponse = requests.post('http://localhost:11434/api/generate',\n  json={\"model\": \"llama3\", \"prompt\": \"Why is the sky blue?\", \"stream\": False})",
    "benchmarks": "N/A — inference speed depends on hardware",
    "limitations": "Local hardware constraints limit model size, not for production serving at scale.",
    "popular": true,
    "url": "https://ollama.com/",
    "citations": [
      {
        "text": "Ollama GitHub",
        "url": "https://github.com/ollama/ollama"
      }
    ]
  },
  {
    "name": "vLLM",
    "type": "Framework",
    "summary": "A fast and easy-to-use library for LLM inference and serving, featuring PagedAttention for near-optimal GPU memory management.",
    "task": "MLOps",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "UC Berkeley",
    "size": "N/A",
    "architecture": "PagedAttention memory manager with continuous batching for high-throughput serving.",
    "usage": "from vllm import LLM, SamplingParams\nllm = LLM(model=\"meta-llama/Meta-Llama-3-8B-Instruct\")\nparams = SamplingParams(temperature=0.8, top_p=0.95)\noutputs = llm.generate([\"Tell me a fun fact about space.\"], params)",
    "benchmarks": "Up to 24x higher throughput than HuggingFace Transformers",
    "limitations": "Primarily optimized for NVIDIA GPUs, less support for AMD/Apple Silicon.",
    "popular": true,
    "url": "https://github.com/vllm-project/vllm",
    "citations": [
      {
        "text": "Kwon et al. (2023) - vLLM Paper",
        "url": "https://arxiv.org/abs/2309.06180"
      }
    ]
  },
  {
    "name": "Hugging Face",
    "type": "Platform",
    "summary": "Open platform for sharing and collaborating on ML models, datasets, and applications.",
    "task": "MLOps",
    "license": "Apache-2.0 (libraries)",
    "year": 2016,
    "org": "Hugging Face Inc.",
    "size": "1M+ models hosted",
    "architecture": "Cloud platform with transformers library, model hub, and deployment tools.",
    "usage": "from transformers import pipeline\nclassifier = pipeline(\"sentiment-analysis\")\nresult = classifier(\"I love this encyclopedia!\")",
    "benchmarks": "Most popular model hub globally",
    "limitations": "Free tier has rate limits, deploying large models requires paid endpoints.",
    "popular": true,
    "url": "https://huggingface.co",
    "citations": [
      {
        "text": "Hugging Face Documentation",
        "url": "https://huggingface.co/docs"
      },
      {
        "text": "Transformers Library",
        "url": "https://github.com/huggingface/transformers"
      }
    ]
  },
  {
    "name": "Perplexity AI",
    "type": "Platform",
    "summary": "An AI-powered search engine that uses LLMs to search the web in real-time, providing conversational answers with direct in-line citations.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "Perplexity",
    "size": "Various (Uses GPT-4, Claude 3, Sonar)",
    "architecture": "RAG (Retrieval-Augmented Generation) pipeline sitting on top of various frontier LLMs.",
    "usage": "from openai import OpenAI\n# Perplexity offers an API compatible with OpenAI's SDK\nclient = OpenAI(api_key=\"PPLX_API_KEY\", base_url=\"https://api.perplexity.ai\")\nresponse = client.chat.completions.create(\n  model=\"llama-3-sonar-large-32k-online\",\n  messages=[{\"role\": \"user\", \"content\": \"What is the news today?\"}]\n)",
    "benchmarks": "N/A",
    "limitations": "Quality depends heavily on the retrieved search results, occasionally hallucinates sources.",
    "popular": true,
    "url": "https://www.perplexity.ai/",
    "citations": [
      {
        "text": "Perplexity API Docs",
        "url": "https://docs.perplexity.ai/"
      }
    ]
  },
  {
    "name": "GitHub Copilot",
    "type": "Platform",
    "summary": "An AI pair programmer integrated directly into code editors, offering real-time code autocomplete and chat functionality.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2021,
    "org": "GitHub (Microsoft) & OpenAI",
    "size": "Based on customized OpenAI models",
    "architecture": "Powered by OpenAI's Codex and newer GPT models tailored for code generation.",
    "usage": "// Type a comment in VS Code to trigger Copilot\n// function to parse a URL and return the domain name\nfunction getDomain(url) {\n  // Copilot suggests: return new URL(url).hostname;\n}",
    "benchmarks": "N/A",
    "limitations": "Paid subscription required, can suggest insecure code patterns.",
    "popular": true,
    "url": "https://github.com/features/copilot",
    "citations": [
      {
        "text": "GitHub Copilot Features",
        "url": "https://github.com/features/copilot"
      }
    ]
  },
  {
    "name": "OpenAI Platform",
    "type": "Platform",
    "summary": "OpenAI's developer API platform providing access to GPT-4, DALL-E, Whisper, embeddings, and fine-tuning capabilities.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2020,
    "org": "OpenAI",
    "size": "N/A",
    "architecture": "REST API with model routing, rate limiting, and usage tracking.",
    "usage": "from openai import OpenAI\nclient = OpenAI(api_key=\"YOUR_API_KEY\")\nresponse = client.chat.completions.create(\n  model=\"gpt-4o\",\n  messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]\n)",
    "benchmarks": "N/A",
    "limitations": "Pay-per-token pricing, rate limits on free tier, proprietary.",
    "popular": true,
    "url": "https://platform.openai.com",
    "citations": [
      {
        "text": "OpenAI API Documentation",
        "url": "https://platform.openai.com/docs"
      }
    ]
  },
  {
    "name": "Vertex AI",
    "type": "Platform",
    "summary": "Google Cloud's unified ML platform for building, deploying, and scaling AI models including access to Gemini, PaLM, and custom model training.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2021,
    "org": "Google Cloud",
    "size": "N/A",
    "architecture": "Managed cloud ML platform with AutoML, custom training, feature store, and model registry.",
    "usage": "import vertexai\nfrom vertexai.generative_models import GenerativeModel\nvertexai.init(project=\"YOUR_PROJECT\", location=\"us-central1\")\nmodel = GenerativeModel(\"gemini-1.5-pro\")\nresponse = model.generate_content(\"Describe the water cycle.\")",
    "benchmarks": "N/A",
    "limitations": "GCP-locked, complex pricing, requires GCP account setup.",
    "popular": true,
    "url": "https://cloud.google.com/vertex-ai",
    "citations": [
      {
        "text": "Vertex AI Documentation",
        "url": "https://cloud.google.com/vertex-ai/docs"
      }
    ]
  },
  {
    "name": "AWS Bedrock",
    "type": "Platform",
    "summary": "Amazon's fully managed service for accessing foundation models from Anthropic, Meta, Mistral, and others via a single API with enterprise security.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2023,
    "org": "Amazon Web Services",
    "size": "N/A",
    "architecture": "Managed API gateway for foundation models with AWS IAM, VPC, and CloudWatch integration.",
    "usage": "import boto3, json\nbedrock = boto3.client('bedrock-runtime', region_name='us-east-1')\nbody = json.dumps({\"prompt\": \"\\n\\nHuman: Hi\\n\\nAssistant:\", \"max_tokens_to_sample\": 300})\nresponse = bedrock.invoke_model(body=body, modelId='anthropic.claude-v2')",
    "benchmarks": "N/A",
    "limitations": "AWS-locked, additional latency vs. direct API, complex IAM setup.",
    "popular": true,
    "url": "https://aws.amazon.com/bedrock/",
    "citations": [
      {
        "text": "AWS Bedrock Documentation",
        "url": "https://docs.aws.amazon.com/bedrock/"
      }
    ]
  },
  {
    "name": "Weights & Biases",
    "type": "Platform",
    "summary": "The ML experiment tracking and model management platform used by researchers worldwide to log metrics, visualize training, and collaborate on models.",
    "task": "MLOps",
    "license": "Proprietary (free for individuals)",
    "year": 2018,
    "org": "Weights & Biases Inc.",
    "size": "N/A",
    "architecture": "Cloud-based experiment tracking with SDK integrations for PyTorch, TensorFlow, JAX, and more.",
    "usage": "import wandb\nwandb.init(project=\"my-project\")\nfor epoch in range(10):\n  loss = train_one_epoch()\n  wandb.log({\"loss\": loss, \"epoch\": epoch})",
    "benchmarks": "N/A",
    "limitations": "Data sent to cloud servers (privacy concern), storage limits on free tier.",
    "popular": true,
    "url": "https://wandb.ai",
    "citations": [
      {
        "text": "W&B Documentation",
        "url": "https://docs.wandb.ai/"
      }
    ]
  },
  {
    "name": "Replicate",
    "type": "Platform",
    "summary": "A cloud platform for running machine learning models via API, making it easy to deploy open-source models like Llama, Stable Diffusion, and Whisper at scale.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2019,
    "org": "Replicate Inc.",
    "size": "N/A",
    "architecture": "Containerized model deployment with Cog packaging and pay-per-prediction pricing.",
    "usage": "import replicate\noutput = replicate.run(\n  \"meta/meta-llama-3-70b-instruct\",\n  input={\"prompt\": \"Write a haiku about AI\"}\n)\nprint(\"\".join(output))",
    "benchmarks": "N/A",
    "limitations": "Pay-per-second pricing can be costly for heavy use, cold start latency.",
    "popular": true,
    "url": "https://replicate.com",
    "citations": [
      {
        "text": "Replicate Documentation",
        "url": "https://replicate.com/docs"
      }
    ]
  },
  {
    "name": "Together AI",
    "type": "Platform",
    "summary": "A cloud platform for fast inference on open-source AI models with competitive pricing, offering fine-tuning and custom deployment.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2022,
    "org": "Together AI",
    "size": "N/A",
    "architecture": "Distributed inference cluster with FlashAttention and custom serving optimizations.",
    "usage": "from together import Together\nclient = Together(api_key=\"YOUR_API_KEY\")\nresponse = client.chat.completions.create(\n  model=\"meta-llama/Llama-3-70b-chat-hf\",\n  messages=[{\"role\": \"user\", \"content\": \"What is RAG?\"}]\n)",
    "benchmarks": "N/A",
    "limitations": "Proprietary, model availability may change.",
    "popular": true,
    "url": "https://www.together.ai/",
    "citations": [
      {
        "text": "Together AI Documentation",
        "url": "https://docs.together.ai/"
      }
    ]
  },
  {
    "name": "Groq",
    "type": "Platform",
    "summary": "An AI inference platform powered by custom LPU (Language Processing Unit) chips, delivering extremely fast token generation for open-source models.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2016,
    "org": "Groq Inc.",
    "size": "N/A",
    "architecture": "LPU hardware with SRAM-based compute delivering deterministic, ultra-low-latency inference.",
    "usage": "from groq import Groq\nclient = Groq(api_key=\"YOUR_API_KEY\")\ncompletion = client.chat.completions.create(\n  model=\"llama3-70b-8192\",\n  messages=[{\"role\": \"user\", \"content\": \"Explain transformers quickly.\"}]\n)",
    "benchmarks": "500+ tokens/second — among fastest public LLM inference APIs",
    "limitations": "Limited model selection, proprietary hardware dependency.",
    "popular": true,
    "url": "https://groq.com/",
    "citations": [
      {
        "text": "Groq Documentation",
        "url": "https://console.groq.com/docs/openai"
      }
    ]
  },
  {
    "name": "Cursor",
    "type": "Platform",
    "summary": "An AI-first code editor (fork of VS Code) with deep model integration, supporting multi-file edits, codebase chat, and agent-based refactoring.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Anysphere",
    "size": "Based on GPT-4, Claude 3.5, and custom models",
    "architecture": "VS Code fork with custom LSP-integrated AI context window and multi-model routing.",
    "usage": "# Cursor is a desktop application\n# Use Cmd+K for inline edits\n# Use Cmd+L to open chat with full codebase context\n# Agent mode: Cmd+Shift+I for autonomous multi-file changes",
    "benchmarks": "N/A — fastest growing AI code editor in 2024",
    "limitations": "Subscription required for full model access, privacy concerns with code uploads.",
    "popular": true,
    "url": "https://cursor.com/",
    "citations": [
      {
        "text": "Cursor Official Site",
        "url": "https://cursor.com/"
      }
    ]
  },
  {
    "name": "Midjourney (Platform)",
    "type": "Platform",
    "summary": "The leading AI image generation platform accessed via Discord and a web interface, powering the most widely used consumer AI art tool.",
    "task": "Computer Vision",
    "license": "Proprietary",
    "year": 2022,
    "org": "Midjourney, Inc.",
    "size": "N/A",
    "architecture": "Proprietary diffusion model served via Discord bot and web UI.",
    "usage": "# Access via Discord or https://www.midjourney.com/\n/imagine prompt: Photograph of a cat wearing a spacesuit on the moon, cinematic lighting --v 6.1 --ar 16:9",
    "benchmarks": "N/A — subjective quality, widely regarded as leader for artistic output",
    "limitations": "No official API, paid subscription, all generations are public on free tier.",
    "popular": true,
    "url": "https://www.midjourney.com/",
    "citations": [
      {
        "text": "Midjourney Website",
        "url": "https://www.midjourney.com/"
      }
    ]
  },
  {
    "name": "Pinecone",
    "type": "Platform",
    "summary": "A managed vector database purpose-built for AI applications, enabling fast similarity search at scale for RAG, semantic search, and recommendation systems.",
    "task": "MLOps",
    "license": "Proprietary",
    "year": 2019,
    "org": "Pinecone Systems",
    "size": "N/A",
    "architecture": "Managed ANNS (Approximate Nearest Neighbor Search) vector store with hybrid search support.",
    "usage": "from pinecone import Pinecone, ServerlessSpec\npc = Pinecone(api_key=\"YOUR_API_KEY\")\npc.create_index(\"my-index\", dimension=1536, metric=\"cosine\", spec=ServerlessSpec(cloud='aws', region='us-east-1'))\nindex = pc.Index(\"my-index\")\nindex.upsert(vectors=[(\"vec1\", [0.1, 0.2], {\"text\": \"hello\"})])",
    "benchmarks": "Sub-10ms query latency at billion-vector scale",
    "limitations": "Proprietary, can be expensive at scale vs. self-hosted alternatives.",
    "popular": true,
    "url": "https://www.pinecone.io/",
    "citations": [
      {
        "text": "Pinecone Documentation",
        "url": "https://docs.pinecone.io/"
      }
    ]
  },
  {
    "name": "ImageNet",
    "type": "Dataset",
    "summary": "Large-scale image dataset with 14M+ images across 20K+ categories.",
    "task": "Computer Vision",
    "license": "Various (academic use)",
    "year": 2009,
    "org": "Stanford / Princeton",
    "size": "14M images, 150GB",
    "architecture": "Hierarchical organization based on WordNet, 1000 classes for ILSVRC.",
    "usage": "from torchvision.datasets import ImageNet\ndataset = ImageNet(root='./data', split='train')",
    "benchmarks": "Standard benchmark for computer vision (ImageNet-1K)",
    "limitations": "Some labeling issues, Western-centric bias.",
    "popular": true,
    "url": "https://image-net.org",
    "citations": [
      {
        "text": "Deng et al. (2009) - ImageNet Paper",
        "url": "https://ieeexplore.ieee.org/document/5206848"
      },
      {
        "text": "Official ImageNet Website",
        "url": "https://image-net.org"
      }
    ]
  },
  {
    "name": "Common Crawl",
    "type": "Dataset",
    "summary": "A massive open repository of web crawl data containing petabytes of raw text used as the primary pre-training corpus for most modern LLMs.",
    "task": "NLP",
    "license": "Public Domain (Terms of Use apply)",
    "year": 2008,
    "org": "Common Crawl Foundation",
    "size": "3+ billion web pages, ~1PB compressed",
    "architecture": "WARC/WET file format of crawled web content across decades.",
    "usage": "# Access via AWS S3 public dataset\nimport boto3\ns3 = boto3.client('s3', region_name='us-east-1')\n# Browse at s3://commoncrawl/\nresponse = s3.list_objects_v2(Bucket='commoncrawl', Prefix='crawl-data/CC-MAIN-2024-10/')",
    "benchmarks": "Used to train GPT-3, LLaMA, Falcon, and virtually all frontier models",
    "limitations": "Requires extensive filtering (toxic content, duplicates, low quality) before use.",
    "popular": true,
    "url": "https://commoncrawl.org/",
    "citations": [
      {
        "text": "Common Crawl Official Site",
        "url": "https://commoncrawl.org/"
      }
    ]
  },
  {
    "name": "The Pile",
    "type": "Dataset",
    "summary": "EleutherAI's 825GB open-source diverse text dataset designed for training large language models, combining 22 high-quality data sources.",
    "task": "NLP",
    "license": "MIT",
    "year": 2020,
    "org": "EleutherAI",
    "size": "825GB, ~300B tokens",
    "architecture": "22 data sources including Books3, GitHub, Wikipedia, PubMed, arXiv, and more.",
    "usage": "# Available on HuggingFace\nfrom datasets import load_dataset\ndataset = load_dataset(\"EleutherAI/pile\", split=\"train\", streaming=True)",
    "benchmarks": "Used to train GPT-NeoX, GPT-J, and other EleutherAI models",
    "limitations": "Some components have license restrictions (Books3 removed after legal challenges).",
    "popular": true,
    "url": "https://pile.eleuther.ai/",
    "citations": [
      {
        "text": "Gao et al. (2020) - The Pile Paper",
        "url": "https://arxiv.org/abs/2101.00027"
      }
    ]
  },
  {
    "name": "LAION-5B",
    "type": "Dataset",
    "summary": "A massive open-source dataset of 5.85 billion CLIP-filtered image-text pairs scraped from the web, used to train Stable Diffusion and other vision models.",
    "task": "Computer Vision",
    "license": "CC BY 4.0",
    "year": 2022,
    "org": "LAION",
    "size": "5.85B image-text pairs (~240TB)",
    "architecture": "CLIP-filtered pairs from Common Crawl with aesthetic, safety, and watermark scores.",
    "usage": "# Access subsets via HuggingFace\nfrom datasets import load_dataset\ndataset = load_dataset(\"laion/laion2B-en\", split=\"train\", streaming=True)",
    "benchmarks": "Enables training of SOTA text-to-image models",
    "limitations": "Contains harmful/copyrighted content, filtered versions recommended.",
    "popular": true,
    "url": "https://laion.ai/blog/laion-5b/",
    "citations": [
      {
        "text": "Schuhmann et al. (2022) - LAION-5B Paper",
        "url": "https://arxiv.org/abs/2210.08402"
      }
    ]
  },
  {
    "name": "MS COCO",
    "type": "Dataset",
    "summary": "Microsoft's benchmark dataset for object detection, segmentation, and captioning with 328K images containing 2.5M labeled object instances.",
    "task": "Computer Vision",
    "license": "CC BY 4.0",
    "year": 2014,
    "org": "Microsoft",
    "size": "328K images, ~25GB",
    "architecture": "Images with bounding boxes, segmentation masks, keypoints, and 5 captions each.",
    "usage": "from torchvision.datasets import CocoDetection\ndataset = CocoDetection(\n  root=\"./data/coco/images/train2017\",\n  annFile=\"./data/coco/annotations/instances_train2017.json\"\n)",
    "benchmarks": "Standard detection benchmark: mAP metric widely used in CV research",
    "limitations": "Object categories limited to 80, some class imbalance.",
    "popular": true,
    "url": "https://cocodataset.org/",
    "citations": [
      {
        "text": "Lin et al. (2014) - COCO Paper",
        "url": "https://arxiv.org/abs/1405.0312"
      }
    ]
  },
  {
    "name": "OpenWebText",
    "type": "Dataset",
    "summary": "An open-source recreation of OpenAI's WebText dataset (used to train GPT-2), scraped from Reddit-upvoted URLs.",
    "task": "NLP",
    "license": "CC0 1.0",
    "year": 2019,
    "org": "EleutherAI / Community",
    "size": "38GB (~8M documents)",
    "architecture": "Web text from all outbound Reddit links with 3+ upvotes, scraped and deduplicated.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"openwebtext\", split=\"train\")",
    "benchmarks": "Used as training data for GPT-2 replications",
    "limitations": "English-only, Reddit bias toward certain demographics and topics.",
    "popular": false,
    "url": "https://huggingface.co/datasets/openwebtext",
    "citations": [
      {
        "text": "OpenWebText on HuggingFace",
        "url": "https://huggingface.co/datasets/openwebtext"
      }
    ]
  },
  {
    "name": "SQuAD 2.0",
    "type": "Dataset",
    "summary": "Stanford Question Answering Dataset with 100K+ questions on Wikipedia passages, including unanswerable questions to test model abstention.",
    "task": "NLP",
    "license": "CC BY-SA 4.0",
    "year": 2018,
    "org": "Stanford NLP",
    "size": "150K questions",
    "architecture": "Crowdsourced QA pairs from Wikipedia, with adversarially added unanswerable questions.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"squad_v2\")\ntrain_data = dataset['train']",
    "benchmarks": "Standard reading comprehension benchmark; human baseline F1: 89.45%",
    "limitations": "English-only, Wikipedia domain, extractive QA only.",
    "popular": true,
    "url": "https://rajpurkar.github.io/SQuAD-explorer/",
    "citations": [
      {
        "text": "Rajpurkar et al. (2018) - SQuAD 2.0 Paper",
        "url": "https://arxiv.org/abs/1806.03822"
      }
    ]
  },
  {
    "name": "MMLU",
    "type": "Dataset",
    "summary": "Massive Multitask Language Understanding — a benchmark covering 57 subjects from STEM to humanities, used to evaluate the knowledge and reasoning of LLMs.",
    "task": "NLP",
    "license": "MIT",
    "year": 2020,
    "org": "UC Berkeley",
    "size": "15,908 questions across 57 subjects",
    "architecture": "Four-choice multiple-choice questions at varying difficulty levels from elementary to professional.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"cais/mmlu\", \"all\")\nprint(dataset['test'][0])",
    "benchmarks": "Human expert baseline: ~89.8%. GPT-4: 86.4%, Claude 3 Opus: 86.8%",
    "limitations": "Multiple-choice format doesn't capture open-ended generation ability.",
    "popular": true,
    "url": "https://github.com/hendrycks/test",
    "citations": [
      {
        "text": "Hendrycks et al. (2020) - MMLU Paper",
        "url": "https://arxiv.org/abs/2009.03300"
      }
    ]
  },
  {
    "name": "HumanEval",
    "type": "Dataset",
    "summary": "OpenAI's benchmark of 164 hand-crafted Python programming problems to evaluate the code generation capability of language models.",
    "task": "NLP",
    "license": "MIT",
    "year": 2021,
    "org": "OpenAI",
    "size": "164 hand-written programming problems",
    "architecture": "Python functions with docstrings and unit tests; evaluated by pass@k metric.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"openai_humaneval\")\nprint(dataset['test'][0]['prompt'])",
    "benchmarks": "GPT-4: 67%, Claude 3.5 Sonnet: 92%, Llama 3 70B: 81.7%",
    "limitations": "Python-only, relatively small size, may be contaminated in model training data.",
    "popular": true,
    "url": "https://github.com/openai/human-eval",
    "citations": [
      {
        "text": "Chen et al. (2021) - Evaluating LLMs Trained on Code",
        "url": "https://arxiv.org/abs/2107.03374"
      }
    ]
  },
  {
    "name": "GSM8K",
    "type": "Dataset",
    "summary": "A dataset of 8,500 high-quality grade-school math word problems requiring multi-step reasoning, used to evaluate arithmetic reasoning in LLMs.",
    "task": "NLP",
    "license": "MIT",
    "year": 2021,
    "org": "OpenAI",
    "size": "8,500 problems (7,500 train / 1,319 test)",
    "architecture": "Multi-step word problems with natural language solutions and final numerical answers.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"gsm8k\", \"main\")\nprint(dataset['test'][0])",
    "benchmarks": "GPT-4: 92%, Claude 3 Opus: 95.0%, Llama 3 70B: 93%",
    "limitations": "Grade-school level only, top models now saturate this benchmark.",
    "popular": true,
    "url": "https://github.com/openai/grade-school-math",
    "citations": [
      {
        "text": "Cobbe et al. (2021) - GSM8K Paper",
        "url": "https://arxiv.org/abs/2110.14168"
      }
    ]
  },
  {
    "name": "RedPajama-Data-v2",
    "type": "Dataset",
    "summary": "Together AI's massive open dataset of 30 trillion tokens with quality annotations, designed as a fully open alternative to proprietary LLM pre-training data.",
    "task": "NLP",
    "license": "Apache-2.0",
    "year": 2023,
    "org": "Together AI",
    "size": "30T tokens (with quality signals)",
    "architecture": "Multi-language web data with 40+ quality annotation signals for filtering.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"togethercomputer/RedPajama-Data-V2\", name=\"sample-10B\", split=\"train\", streaming=True)",
    "benchmarks": "Enables competitive open LLM training at scale",
    "limitations": "Requires careful filtering, quality signals are heuristic-based.",
    "popular": true,
    "url": "https://github.com/togethercomputer/RedPajama-Data",
    "citations": [
      {
        "text": "RedPajama-V2 Paper",
        "url": "https://arxiv.org/abs/2402.06935"
      }
    ]
  },
  {
    "name": "Alpaca Dataset",
    "type": "Dataset",
    "summary": "Stanford's 52K instruction-following examples generated by GPT-3.5, kickstarting the open-source instruction tuning movement.",
    "task": "NLP",
    "license": "CC BY NC 4.0",
    "year": 2023,
    "org": "Stanford CRFM",
    "size": "52,002 instruction-following pairs",
    "architecture": "Self-Instruct format: instruction, input (optional), and output triples.",
    "usage": "from datasets import load_dataset\ndataset = load_dataset(\"tatsu-lab/alpaca\")\nprint(dataset['train'][0])",
    "benchmarks": "Fine-tuning LLaMA 7B on this data produces near-ChatGPT quality",
    "limitations": "Non-commercial license, GPT-3.5 generated (potential errors), English-only.",
    "popular": false,
    "url": "https://github.com/tatsu-lab/stanford_alpaca",
    "citations": [
      {
        "text": "Alpaca Dataset Release",
        "url": "https://crfm.stanford.edu/2023/03/13/alpaca.html"
      }
    ]
  },
  {
    "name": "ChatGPT",
    "type": "AI",
    "summary": "An advanced AI assistant by OpenAI, utilizing the GPT-4 family of models to converse, write code, and assist with a wide range of tasks.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "OpenAI",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by GPT-4/GPT-4o)",
    "usage": "Visit chatgpt.com to interact via the web interface.",
    "benchmarks": "N/A (See underlying models like GPT-4o)",
    "limitations": "May hallucinate, knowledge cutoff depends on the model version.",
    "popular": true,
    "url": "https://chatgpt.com",
    "citations": [
      {
        "text": "ChatGPT Announcement",
        "url": "https://openai.com/blog/chatgpt"
      }
    ]
  },
  {
    "name": "Claude",
    "type": "AI",
    "summary": "Anthropic's AI assistant, known for its high capabilities in coding, writing, and logical reasoning, and featuring a large context window.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Anthropic",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Claude 3/3.5 Family)",
    "usage": "Visit claude.ai to interact via the web interface.",
    "benchmarks": "N/A (See underlying models like Claude 3.5 Sonnet)",
    "limitations": "May refuse prompts due to strict safety filters.",
    "popular": true,
    "url": "https://claude.ai",
    "citations": [
      {
        "text": "Claude Announcement",
        "url": "https://www.anthropic.com/claude"
      }
    ]
  },
  {
    "name": "Perplexity",
    "type": "AI",
    "summary": "An AI-powered search engine that provides cited answers by searching the web in real-time, functioning as an intelligent research assistant.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "Perplexity AI",
    "size": "N/A",
    "architecture": "Answer Engine / Conversational Agent (Powered by various LLMs and search indices)",
    "usage": "Visit perplexity.ai to search and interact.",
    "benchmarks": "N/A",
    "limitations": "Sometimes cites incorrect sources or misunderstands query intent.",
    "popular": true,
    "url": "https://www.perplexity.ai",
    "citations": [
      {
        "text": "Perplexity AI",
        "url": "https://www.perplexity.ai"
      }
    ]
  },
  {
    "name": "DeepSeek Chat",
    "type": "AI",
    "summary": "An intelligent AI assistant by DeepSeek, highly capable in coding, math, and logical reasoning, powered by efficient open-weight models.",
    "task": "NLP",
    "license": "Proprietary / DeepSeek License",
    "year": 2023,
    "org": "DeepSeek AI",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by DeepSeek-V2 / DeepSeek Coder)",
    "usage": "Visit chat.deepseek.com to interact.",
    "benchmarks": "N/A",
    "limitations": "May struggle with some niche topics compared to ChatGPT or Claude.",
    "popular": true,
    "url": "https://chat.deepseek.com",
    "citations": [
      {
        "text": "DeepSeek Chat",
        "url": "https://chat.deepseek.com"
      }
    ]
  },
  {
    "name": "Google Gemini",
    "type": "AI",
    "summary": "Google's flagship AI assistant (formerly Bard), featuring multimodal capabilities and tight integration with Google Workspace.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Google DeepMind",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Gemini Pro / Ultra models)",
    "usage": "Visit gemini.google.com to interact.",
    "benchmarks": "N/A",
    "limitations": "May hallucinate, some features are restricted by region.",
    "popular": true,
    "url": "https://gemini.google.com",
    "citations": [
      {
        "text": "Gemini Announcement",
        "url": "https://blog.google/technology/ai/google-gemini-ai/"
      }
    ]
  },
  {
    "name": "Microsoft Copilot",
    "type": "AI",
    "summary": "Microsoft's AI assistant (formerly Bing Chat), integrated with Windows and Microsoft 365, combining GPT-4 with real-time web search.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Microsoft",
    "size": "N/A",
    "architecture": "Web Application / OS Integration (Powered by GPT-4 and Bing Search)",
    "usage": "Visit copilot.microsoft.com or use it directly in Windows 11 / Edge.",
    "benchmarks": "N/A",
    "limitations": "Can be slow during peak times, responses are sometimes limited in length.",
    "popular": true,
    "url": "https://copilot.microsoft.com",
    "citations": [
      {
        "text": "Copilot Announcement",
        "url": "https://blogs.microsoft.com/blog/2023/09/21/announcing-microsoft-copilot-your-everyday-ai-companion/"
      }
    ]
  },
  {
    "name": "Grok",
    "type": "AI",
    "summary": "An AI assistant developed by xAI, designed to have a bit of wit, a rebellious streak, and real-time access to X (Twitter) data.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "xAI",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Grok models)",
    "usage": "Access via X Premium subscription.",
    "benchmarks": "N/A",
    "limitations": "Requires an active X Premium subscription.",
    "popular": true,
    "url": "https://x.ai",
    "citations": [
      {
        "text": "Grok Announcement",
        "url": "https://x.ai/blog/grok"
      }
    ]
  },
  {
    "name": "Meta AI",
    "type": "AI",
    "summary": "Meta's smart assistant integrated into WhatsApp, Instagram, Facebook, and Messenger, capable of answering questions and generating images.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Meta",
    "size": "N/A",
    "architecture": "Chatbot Integration (Powered by Llama 3 models)",
    "usage": "Use it directly inside Meta's messaging apps or at meta.ai.",
    "benchmarks": "N/A",
    "limitations": "Feature availability varies by country and platform.",
    "popular": true,
    "url": "https://www.meta.ai",
    "citations": [
      {
        "text": "Meta AI Announcement",
        "url": "https://about.fb.com/news/2023/09/introducing-ai-experiences-across-our-family-of-apps-and-devices/"
      }
    ]
  },
  {
    "name": "HuggingChat",
    "type": "AI",
    "summary": "An open-source AI assistant by Hugging Face, allowing users to converse with various top-tier open-weight models.",
    "task": "NLP",
    "license": "Open Source UI / Various model licenses",
    "year": 2023,
    "org": "Hugging Face",
    "size": "N/A",
    "architecture": "Web Application (Supports Llama, Mistral, Command R, etc.)",
    "usage": "Visit huggingface.co/chat to interact.",
    "benchmarks": "N/A",
    "limitations": "Model availability may rotate, performance depends on the selected underlying model.",
    "popular": true,
    "url": "https://huggingface.co/chat",
    "citations": [
      {
        "text": "HuggingChat",
        "url": "https://huggingface.co/chat"
      }
    ]
  },
  {
    "name": "GitHub Copilot",
    "type": "AI",
    "summary": "An AI pair programmer that offers autocomplete-style suggestions as you code, integrated directly into your IDE.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2021,
    "org": "GitHub",
    "size": "N/A",
    "architecture": "IDE Extension / Service (Powered by OpenAI models)",
    "usage": "Install the GitHub Copilot extension in VS Code or JetBrains IDEs.",
    "benchmarks": "N/A",
    "limitations": "Paid subscription required, may suggest incorrect or insecure code.",
    "popular": true,
    "url": "https://github.com/features/copilot",
    "citations": [
      {
        "text": "GitHub Copilot",
        "url": "https://github.com/features/copilot"
      }
    ]
  },
  {
    "name": "Character.ai",
    "type": "AI",
    "summary": "A neural language model chatbot web application that can generate human-like text responses and participate in contextual conversation, often used for roleplay.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "Character Technologies",
    "size": "N/A",
    "architecture": "Web Application / Chatbot (Custom LLMs)",
    "usage": "Visit character.ai to chat with community-created characters.",
    "benchmarks": "N/A",
    "limitations": "Highly filtered, mainly focused on entertainment rather than factual accuracy.",
    "popular": true,
    "url": "https://character.ai",
    "citations": [
      {
        "text": "Character.ai",
        "url": "https://character.ai"
      }
    ]
  },
  {
    "name": "Pi",
    "type": "AI",
    "summary": "A supportive and empathetic conversational AI assistant designed to be a companion rather than just a tool.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Inflection AI",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Inflection models)",
    "usage": "Visit pi.ai to interact.",
    "benchmarks": "N/A",
    "limitations": "Prioritizes conversational style over complex reasoning or coding tasks.",
    "popular": true,
    "url": "https://pi.ai",
    "citations": [
      {
        "text": "Meet Pi",
        "url": "https://inflection.ai/press/meet-pi"
      }
    ]
  },
  {
    "name": "Mistral Le Chat",
    "type": "AI",
    "summary": "A fast and capable conversational AI assistant by Mistral AI, built on their own open-weight models with a focus on efficiency.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2024,
    "org": "Mistral AI",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Mistral Large / Mistral Small)",
    "usage": "Visit chat.mistral.ai to interact via the web interface.",
    "benchmarks": "N/A",
    "limitations": "Smaller ecosystem compared to OpenAI or Google; some advanced features require a paid plan.",
    "popular": true,
    "url": "https://chat.mistral.ai",
    "citations": [
      {
        "text": "Mistral Le Chat",
        "url": "https://chat.mistral.ai"
      }
    ]
  },
  {
    "name": "Poe",
    "type": "AI",
    "summary": "A platform by Quora that provides access to multiple AI chatbots including GPT-4, Claude, Gemini, and community-created bots in one unified interface.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Quora",
    "size": "N/A",
    "architecture": "Web Application / Multi-Model Platform (Aggregates GPT-4, Claude, Gemini, Llama, etc.)",
    "usage": "Visit poe.com or download the Poe app to access multiple AI models.",
    "benchmarks": "N/A",
    "limitations": "Daily message limits on free tier; quality depends on the chosen underlying model.",
    "popular": true,
    "url": "https://poe.com",
    "citations": [
      {
        "text": "Poe by Quora",
        "url": "https://poe.com"
      }
    ]
  },
  {
    "name": "You.com",
    "type": "AI",
    "summary": "An AI-powered search and chat assistant that combines real-time web search with conversational AI, offering modes for research, coding, and writing.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2022,
    "org": "You.com",
    "size": "N/A",
    "architecture": "Answer Engine / Conversational Agent (Powered by multiple LLMs and web indices)",
    "usage": "Visit you.com to search and interact with the AI assistant.",
    "benchmarks": "N/A",
    "limitations": "Quality varies depending on the selected AI mode; some features are behind a paywall.",
    "popular": false,
    "url": "https://you.com",
    "citations": [
      {
        "text": "You.com",
        "url": "https://you.com"
      }
    ]
  },
  {
    "name": "Cohere Coral",
    "type": "AI",
    "summary": "An enterprise-focused conversational AI assistant by Cohere, designed for business use cases like search, summarization, and knowledge retrieval.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Cohere",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by Command R+ models)",
    "usage": "Visit coral.cohere.com to interact via the web interface.",
    "benchmarks": "N/A",
    "limitations": "Primarily optimized for enterprise workflows; less suited for casual general-purpose use.",
    "popular": false,
    "url": "https://coral.cohere.com",
    "citations": [
      {
        "text": "Cohere Coral",
        "url": "https://coral.cohere.com"
      }
    ]
  },
  {
    "name": "ERNIE Bot",
    "type": "AI",
    "summary": "Baidu's conversational AI assistant powered by the ERNIE large language model, strong in Chinese language tasks and integrated with Baidu Search.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Baidu",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by ERNIE 4.0)",
    "usage": "Visit yiyan.baidu.com to interact; primarily available in China.",
    "benchmarks": "N/A",
    "limitations": "Primarily optimized for Chinese language; access outside China may be restricted.",
    "popular": false,
    "url": "https://yiyan.baidu.com",
    "citations": [
      {
        "text": "ERNIE Bot",
        "url": "https://yiyan.baidu.com"
      }
    ]
  },
  {
    "name": "HyperCLOVA X",
    "type": "AI",
    "summary": "Naver's large-scale Korean-English bilingual AI assistant, fine-tuned for Korean cultural context and integrated into Naver's search and services.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2023,
    "org": "Naver",
    "size": "N/A",
    "architecture": "Web Application / Conversational Agent (Powered by HyperCLOVA X model)",
    "usage": "Access via clova.ai or integrated directly into Naver Search and other Naver services.",
    "benchmarks": "N/A",
    "limitations": "Primarily focused on Korean and English; limited global availability.",
    "popular": false,
    "url": "https://clova.ai",
    "citations": [
      {
        "text": "HyperCLOVA X",
        "url": "https://clova.ai"
      }
    ]
  },
  {
    "name": "Cursor",
    "type": "AI",
    "summary": "An AI-first code editor forked from VS Code, deeply integrating LLMs for inline code generation, multi-file edits, and natural language codebase chat.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2023,
    "org": "Anysphere",
    "size": "N/A",
    "architecture": "IDE Application (VS Code fork integrating GPT-4, Claude, and custom models)",
    "usage": "Download and install from cursor.com; works as a drop-in VS Code replacement.",
    "benchmarks": "N/A",
    "limitations": "Paid subscription for full AI features; privacy concerns around sending code to external APIs.",
    "popular": true,
    "url": "https://cursor.com",
    "citations": [
      {
        "text": "Cursor",
        "url": "https://cursor.com"
      }
    ]
  },
  {
    "name": "Tabnine",
    "type": "AI",
    "summary": "An AI code completion assistant that integrates with most IDEs and supports local or cloud-based models, offering a privacy-conscious alternative to cloud-only tools.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2019,
    "org": "Tabnine",
    "size": "N/A",
    "architecture": "IDE Plugin (Supports local models + cloud models; integrates with VS Code, JetBrains, Neovim, etc.)",
    "usage": "Install the Tabnine extension from your IDE's marketplace (VS Code, JetBrains, Neovim, etc.).",
    "benchmarks": "N/A",
    "limitations": "Free tier has limited completions; local model mode requires a capable machine.",
    "popular": false,
    "url": "https://www.tabnine.com",
    "citations": [
      {
        "text": "Tabnine",
        "url": "https://www.tabnine.com"
      }
    ]
  },
  {
    "name": "Replit Ghostwriter",
    "type": "AI",
    "summary": "An AI coding assistant built into the Replit online IDE, offering code completion, explanation, transformation, and a conversational chat interface for debugging.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2022,
    "org": "Replit",
    "size": "N/A",
    "architecture": "Web IDE Integration (Powered by custom models and third-party LLMs)",
    "usage": "Access at replit.com; Ghostwriter is available in the editor with a Replit Core subscription.",
    "benchmarks": "N/A",
    "limitations": "Requires a paid Replit Core plan; primarily designed for use within the Replit environment.",
    "popular": true,
    "url": "https://replit.com/ai",
    "citations": [
      {
        "text": "Replit Ghostwriter",
        "url": "https://replit.com/ai"
      }
    ]
  },
  {
    "name": "Amazon CodeWhisperer",
    "type": "AI",
    "summary": "Amazon's AI code generator integrated into popular IDEs, trained on billions of lines of code and AWS APIs, with built-in security vulnerability scanning.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2022,
    "org": "Amazon Web Services",
    "size": "N/A",
    "architecture": "IDE Extension (Integrates with VS Code, JetBrains, AWS Cloud9, and more)",
    "usage": "Install the AWS Toolkit extension in VS Code or JetBrains and sign in with an AWS Builder ID.",
    "benchmarks": "N/A",
    "limitations": "Best suited for AWS-related codebases; individual tier is free but team features are paid.",
    "popular": true,
    "url": "https://aws.amazon.com/codewhisperer",
    "citations": [
      {
        "text": "Amazon CodeWhisperer",
        "url": "https://aws.amazon.com/codewhisperer"
      }
    ]
  },
  {
    "name": "Windsurf",
    "type": "AI",
    "summary": "An AI-powered code editor by Codeium featuring 'Flows' — a deeply agentic coding experience where AI and developer collaborate on the same codebase simultaneously.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2024,
    "org": "Codeium",
    "size": "N/A",
    "architecture": "IDE Application (VS Code fork with proprietary Codeium AI and agentic flow engine)",
    "usage": "Download from codeium.com/windsurf and install as a standalone IDE.",
    "benchmarks": "N/A",
    "limitations": "Newer product with a smaller community than Cursor; some agentic features are still maturing.",
    "popular": true,
    "url": "https://codeium.com/windsurf",
    "citations": [
      {
        "text": "Windsurf by Codeium",
        "url": "https://codeium.com/windsurf"
      }
    ]
  },
  {
    "name": "Bolt.new",
    "type": "AI",
    "summary": "A browser-based AI full-stack development environment by StackBlitz that lets users prompt, run, edit, and deploy complete web applications without any local setup.",
    "task": "AI Coding",
    "license": "Proprietary",
    "year": 2024,
    "org": "StackBlitz",
    "size": "N/A",
    "architecture": "Web Application (Powered by Claude and other LLMs with WebContainers runtime)",
    "usage": "Visit bolt.new and describe the app you want to build; it generates and runs the code instantly.",
    "benchmarks": "N/A",
    "limitations": "Free tier has prompt/token limits; complex apps may require significant manual debugging.",
    "popular": true,
    "url": "https://bolt.new",
    "citations": [
      {
        "text": "Bolt.new",
        "url": "https://bolt.new"
      }
    ]
  },
  {
    "name": "Midjourney",
    "type": "AI",
    "summary": "An AI image generation service known for producing highly artistic and aesthetically striking images from text prompts, operated via Discord.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2022,
    "org": "Midjourney Inc.",
    "size": "N/A",
    "architecture": "Web Application / Discord Bot (Proprietary diffusion model)",
    "usage": "Join the Midjourney Discord server at discord.gg/midjourney and use /imagine commands.",
    "benchmarks": "N/A",
    "limitations": "Requires a paid subscription; primarily Discord-based; limited control over prompt precision.",
    "popular": true,
    "url": "https://www.midjourney.com",
    "citations": [
      {
        "text": "Midjourney",
        "url": "https://www.midjourney.com"
      }
    ]
  },
  {
    "name": "Adobe Firefly",
    "type": "AI",
    "summary": "Adobe's generative AI tool for image creation and editing, integrated into Photoshop and other Creative Cloud apps, trained exclusively on licensed content.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2023,
    "org": "Adobe",
    "size": "N/A",
    "architecture": "Web Application / Creative Suite Integration (Proprietary diffusion model)",
    "usage": "Visit firefly.adobe.com or use Generative Fill directly inside Adobe Photoshop.",
    "benchmarks": "N/A",
    "limitations": "Requires an Adobe account; best features need a Creative Cloud subscription.",
    "popular": true,
    "url": "https://firefly.adobe.com",
    "citations": [
      {
        "text": "Adobe Firefly",
        "url": "https://firefly.adobe.com"
      }
    ]
  },
  {
    "name": "Leonardo.ai",
    "type": "AI",
    "summary": "A versatile AI image generation platform popular with game developers and artists, offering fine-tuned models, canvas editing, and consistent character generation.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2022,
    "org": "Leonardo.ai",
    "size": "N/A",
    "architecture": "Web Application (Powered by Stable Diffusion fine-tunes and proprietary models)",
    "usage": "Visit leonardo.ai, create an account, and generate images using built-in or custom models.",
    "benchmarks": "N/A",
    "limitations": "Daily token limit on the free plan; advanced features like real-time canvas require paid credits.",
    "popular": true,
    "url": "https://leonardo.ai",
    "citations": [
      {
        "text": "Leonardo.ai",
        "url": "https://leonardo.ai"
      }
    ]
  },
  {
    "name": "Ideogram",
    "type": "AI",
    "summary": "An AI image generation tool that excels at rendering accurate, legible text within images — a long-standing weakness of most diffusion models.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2023,
    "org": "Ideogram AI",
    "size": "N/A",
    "architecture": "Web Application (Proprietary text-aware image generation model)",
    "usage": "Visit ideogram.ai, sign in, and generate images with text prompts including typographic elements.",
    "benchmarks": "N/A",
    "limitations": "Free tier limits daily generations; less photorealistic than Midjourney for non-text images.",
    "popular": true,
    "url": "https://ideogram.ai",
    "citations": [
      {
        "text": "Ideogram AI",
        "url": "https://ideogram.ai"
      }
    ]
  },
  {
    "name": "Playground AI",
    "type": "AI",
    "summary": "A free-to-use online AI image generation platform offering a generous free tier and a canvas editor for creating and mixing images with various model styles.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2022,
    "org": "Playground AI",
    "size": "N/A",
    "architecture": "Web Application (Powered by Stable Diffusion variants and proprietary Playground v2 model)",
    "usage": "Visit playground.com to generate images for free with up to 500 images/day on the free tier.",
    "benchmarks": "N/A",
    "limitations": "Heavy users need a paid plan; commercial use of generated images requires a paid subscription.",
    "popular": false,
    "url": "https://playground.com",
    "citations": [
      {
        "text": "Playground AI",
        "url": "https://playground.com"
      }
    ]
  },
  {
    "name": "NightCafe",
    "type": "AI",
    "summary": "An AI art generator and social community platform with multiple generation algorithms, daily free credits, and art challenges for creators.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2019,
    "org": "NightCafe Studio",
    "size": "N/A",
    "architecture": "Web Application (Supports Stable Diffusion, DALL·E, and other generation backends)",
    "usage": "Visit creator.nightcafe.studio to generate images and participate in the community.",
    "benchmarks": "N/A",
    "limitations": "Limited free credits; best results often require purchased credit packs.",
    "popular": false,
    "url": "https://creator.nightcafe.studio",
    "citations": [
      {
        "text": "NightCafe Creator",
        "url": "https://creator.nightcafe.studio"
      }
    ]
  },
  {
    "name": "Runway",
    "type": "AI",
    "summary": "An AI-powered creative platform for generating and editing videos from text or image prompts, widely used in professional film and content production.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2022,
    "org": "Runway",
    "size": "N/A",
    "architecture": "Web Application (Proprietary video diffusion model — Gen-2 / Gen-3 Alpha)",
    "usage": "Access via app.runwayml.com; generate videos from text or image prompts through the web interface.",
    "benchmarks": "N/A",
    "limitations": "Expensive credits system; generation length is capped; occasional temporal inconsistencies.",
    "popular": true,
    "url": "https://runwayml.com",
    "citations": [
      {
        "text": "Runway Gen-3 Alpha",
        "url": "https://runwayml.com/research/gen-3-alpha"
      }
    ]
  },
  {
    "name": "Pika Labs",
    "type": "AI",
    "summary": "An AI video generation and editing tool that can create and modify short video clips from text or image prompts, known for fun and accessible creative outputs.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2023,
    "org": "Pika Labs",
    "size": "N/A",
    "architecture": "Web Application / Discord Bot (Proprietary video generation model — Pika 1.0/2.0)",
    "usage": "Visit pika.art to generate and edit videos from text or image prompts.",
    "benchmarks": "N/A",
    "limitations": "Short maximum clip duration; free tier has watermarks and limited generation credits.",
    "popular": true,
    "url": "https://pika.art",
    "citations": [
      {
        "text": "Pika Labs",
        "url": "https://pika.art"
      }
    ]
  },
  {
    "name": "Kling AI",
    "type": "AI",
    "summary": "A powerful AI video generation model by Kuaishou capable of producing realistic 2-minute videos at 1080p from text or image inputs.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2024,
    "org": "Kuaishou",
    "size": "N/A",
    "architecture": "Web Application (Proprietary video diffusion model with 3D spatiotemporal attention)",
    "usage": "Access via klingai.com; generate videos from text prompts or reference images.",
    "benchmarks": "N/A",
    "limitations": "Longer generation times compared to some competitors; some features require a paid plan.",
    "popular": true,
    "url": "https://klingai.com",
    "citations": [
      {
        "text": "Kling AI",
        "url": "https://klingai.com"
      }
    ]
  },
  {
    "name": "HeyGen",
    "type": "AI",
    "summary": "An AI video generation platform specializing in realistic AI avatar videos and video translation with lip-sync, widely used for marketing and corporate communications.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2020,
    "org": "HeyGen",
    "size": "N/A",
    "architecture": "Web Application (Proprietary talking-head synthesis and lip-sync AI model)",
    "usage": "Visit heygen.com, choose an avatar or upload your own, write a script, and generate a video.",
    "benchmarks": "N/A",
    "limitations": "Free tier is very limited; video translation accuracy can vary with complex audio.",
    "popular": true,
    "url": "https://www.heygen.com",
    "citations": [
      {
        "text": "HeyGen",
        "url": "https://www.heygen.com"
      }
    ]
  },
  {
    "name": "Luma Dream Machine",
    "type": "AI",
    "summary": "Luma AI's fast and high-quality video generation model that creates realistic, physically accurate video clips from text prompts or still images.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2024,
    "org": "Luma AI",
    "size": "N/A",
    "architecture": "Web Application (Proprietary video diffusion model with physics-aware generation)",
    "usage": "Visit lumalabs.ai/dream-machine to generate videos from text or image inputs.",
    "benchmarks": "N/A",
    "limitations": "Free tier has limited monthly generations; longer clips require paid credits.",
    "popular": true,
    "url": "https://lumalabs.ai/dream-machine",
    "citations": [
      {
        "text": "Luma Dream Machine",
        "url": "https://lumalabs.ai/dream-machine"
      }
    ]
  },
  {
    "name": "Synthesia",
    "type": "AI",
    "summary": "An AI video generation platform that creates professional videos with realistic AI avatars speaking from a script, used widely for corporate training and marketing.",
    "task": "Video Generation",
    "license": "Proprietary",
    "year": 2017,
    "org": "Synthesia",
    "size": "N/A",
    "architecture": "Web Application (Proprietary talking-head video synthesis model)",
    "usage": "Visit synthesia.io, write a script, choose an AI avatar, and generate a video in minutes.",
    "benchmarks": "N/A",
    "limitations": "Limited avatar customization on lower-tier plans; video style can feel corporate.",
    "popular": true,
    "url": "https://www.synthesia.io",
    "citations": [
      {
        "text": "Synthesia",
        "url": "https://www.synthesia.io"
      }
    ]
  },
  {
    "name": "ElevenLabs",
    "type": "AI",
    "summary": "A leading AI voice synthesis platform capable of cloning voices and generating ultra-realistic speech in multiple languages from text.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2022,
    "org": "ElevenLabs",
    "size": "N/A",
    "architecture": "Web Application / API (Proprietary TTS and voice cloning models)",
    "usage": "Visit elevenlabs.io to generate speech or use the ElevenLabs API for programmatic access.",
    "benchmarks": "N/A",
    "limitations": "Free tier has limited monthly character quota; voice cloning requires audio samples.",
    "popular": true,
    "url": "https://elevenlabs.io",
    "citations": [
      {
        "text": "ElevenLabs",
        "url": "https://elevenlabs.io"
      }
    ]
  },
  {
    "name": "Murf AI",
    "type": "AI",
    "summary": "An AI voice generator and text-to-speech studio offering 120+ realistic voices in 20+ languages, with a built-in editor for voiceovers and presentations.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2020,
    "org": "Murf Inc.",
    "size": "N/A",
    "architecture": "Web Application (Proprietary neural TTS model with studio-grade audio processing)",
    "usage": "Visit murf.ai to type or paste text, choose a voice, and generate and download audio.",
    "benchmarks": "N/A",
    "limitations": "Free tier has a 10-minute voice generation limit; downloads require a paid plan.",
    "popular": false,
    "url": "https://murf.ai",
    "citations": [
      {
        "text": "Murf AI",
        "url": "https://murf.ai"
      }
    ]
  },
  {
    "name": "Descript",
    "type": "AI",
    "summary": "An AI-powered audio and video editing tool that lets users edit media by editing the transcript, with features like voice cloning, filler word removal, and overdub.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2017,
    "org": "Descript",
    "size": "N/A",
    "architecture": "Desktop / Web Application (Proprietary ASR + TTS + video editing pipeline)",
    "usage": "Download Descript from descript.com; import audio or video and edit by modifying the transcript.",
    "benchmarks": "N/A",
    "limitations": "Overdub voice cloning requires recording samples; some AI features are in paid tiers only.",
    "popular": true,
    "url": "https://www.descript.com",
    "citations": [
      {
        "text": "Descript",
        "url": "https://www.descript.com"
      }
    ]
  },
  {
    "name": "Adobe Podcast",
    "type": "AI",
    "summary": "Adobe's AI audio enhancement tool that automatically removes background noise and enhances microphone quality to make any recording sound studio-recorded.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2022,
    "org": "Adobe",
    "size": "N/A",
    "architecture": "Web Application (Proprietary AI speech enhancement model — Project Shasta)",
    "usage": "Visit podcast.adobe.com, upload an audio file, and use Enhance Speech to clean up the recording.",
    "benchmarks": "N/A",
    "limitations": "Works best on speech; music or mixed audio may degrade; requires an Adobe account.",
    "popular": true,
    "url": "https://podcast.adobe.com",
    "citations": [
      {
        "text": "Adobe Podcast",
        "url": "https://podcast.adobe.com"
      }
    ]
  },
  {
    "name": "Play.ht",
    "type": "AI",
    "summary": "An AI voice generator and text-to-speech platform with 900+ ultra-realistic voices, offering voice cloning and an API for developers to embed audio in apps.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2016,
    "org": "Play.ht",
    "size": "N/A",
    "architecture": "Web Application / API (Powered by proprietary PlayHT 2.0 and PlayDialog models)",
    "usage": "Visit play.ht to generate speech from text or access the API for programmatic voice generation.",
    "benchmarks": "N/A",
    "limitations": "Voice cloning and API access require paid plans; free tier has limited word generation.",
    "popular": false,
    "url": "https://play.ht",
    "citations": [
      {
        "text": "Play.ht",
        "url": "https://play.ht"
      }
    ]
  },
  {
    "name": "Suno",
    "type": "AI",
    "summary": "An AI music generation platform that creates full songs with vocals, instrumentation, and lyrics from a simple text prompt in seconds.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2023,
    "org": "Suno Inc.",
    "size": "N/A",
    "architecture": "Web Application (Proprietary audio diffusion and language model pipeline)",
    "usage": "Visit suno.com and type a prompt describing the style or lyrics to generate a full song.",
    "benchmarks": "N/A",
    "limitations": "Limited control over fine-grained musical elements; commercial use requires a paid plan.",
    "popular": true,
    "url": "https://suno.com",
    "citations": [
      {
        "text": "Suno AI",
        "url": "https://suno.com"
      }
    ]
  },
  {
    "name": "Udio",
    "type": "AI",
    "summary": "An AI music creation tool that generates high-quality, diverse music tracks with vocals and instrumentation from short text descriptions.",
    "task": "Audio",
    "license": "Proprietary",
    "year": 2024,
    "org": "Udio",
    "size": "N/A",
    "architecture": "Web Application (Proprietary generative audio model)",
    "usage": "Visit udio.com, describe the music style or mood, and generate tracks instantly.",
    "benchmarks": "N/A",
    "limitations": "Free tier has monthly generation limits; less genre variety compared to Suno in some styles.",
    "popular": true,
    "url": "https://www.udio.com",
    "citations": [
      {
        "text": "Udio",
        "url": "https://www.udio.com"
      }
    ]
  },
  {
    "name": "Notion AI",
    "type": "AI",
    "summary": "An AI writing and productivity assistant built directly into Notion, capable of drafting, summarizing, translating, and brainstorming within your workspace.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2023,
    "org": "Notion Labs",
    "size": "N/A",
    "architecture": "SaaS Integration (Powered by OpenAI GPT-4 and Anthropic Claude models)",
    "usage": "Access inside any Notion workspace by pressing the spacebar or typing /AI on any page.",
    "benchmarks": "N/A",
    "limitations": "Requires a Notion AI add-on subscription; dependent on third-party LLM providers.",
    "popular": true,
    "url": "https://www.notion.so/product/ai",
    "citations": [
      {
        "text": "Notion AI",
        "url": "https://www.notion.so/product/ai"
      }
    ]
  },
  {
    "name": "Grammarly",
    "type": "AI",
    "summary": "An AI-powered writing assistant that checks grammar, spelling, tone, clarity, and style in real-time across browsers, documents, and email clients.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2009,
    "org": "Grammarly Inc.",
    "size": "N/A",
    "architecture": "Browser Extension / SaaS (Proprietary NLP models + generative AI layer)",
    "usage": "Install the Grammarly browser extension from grammarly.com or use the desktop app.",
    "benchmarks": "N/A",
    "limitations": "Premium plan required for advanced suggestions; can occasionally suggest unnatural rephrasing.",
    "popular": true,
    "url": "https://www.grammarly.com",
    "citations": [
      {
        "text": "Grammarly",
        "url": "https://www.grammarly.com"
      }
    ]
  },
  {
    "name": "Copy.ai",
    "type": "AI",
    "summary": "An AI-powered copywriting tool that generates marketing copy, product descriptions, email sequences, social media posts, and more from short prompts.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2020,
    "org": "Copy.ai",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 with marketing-specific workflows and templates)",
    "usage": "Visit copy.ai, select a content type template, enter your product info, and generate copy.",
    "benchmarks": "N/A",
    "limitations": "Outputs often require editing; free tier limits monthly word count.",
    "popular": true,
    "url": "https://www.copy.ai",
    "citations": [
      {
        "text": "Copy.ai",
        "url": "https://www.copy.ai"
      }
    ]
  },
  {
    "name": "Jasper",
    "type": "AI",
    "summary": "An AI content writing platform designed for marketing teams, capable of generating blog posts, ad copy, social media content, and brand-consistent text at scale.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2021,
    "org": "Jasper AI",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 and other LLMs with marketing-specific fine-tuning)",
    "usage": "Visit jasper.ai to sign up and use the web editor for AI content generation.",
    "benchmarks": "N/A",
    "limitations": "Expensive subscription plans; outputs may still require human editing for accuracy.",
    "popular": false,
    "url": "https://www.jasper.ai",
    "citations": [
      {
        "text": "Jasper AI",
        "url": "https://www.jasper.ai"
      }
    ]
  },
  {
    "name": "Writesonic",
    "type": "AI",
    "summary": "An AI writing assistant and chatbot platform that helps generate SEO-optimized articles, landing pages, ads, and social media content at scale.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2020,
    "org": "Writesonic",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 with SEO and marketing-specific tooling)",
    "usage": "Visit writesonic.com to access the editor and start generating content with templates.",
    "benchmarks": "N/A",
    "limitations": "Quality can vary for niche topics; word credit limits apply on most plans.",
    "popular": false,
    "url": "https://writesonic.com",
    "citations": [
      {
        "text": "Writesonic",
        "url": "https://writesonic.com"
      }
    ]
  },
  {
    "name": "Tome",
    "type": "AI",
    "summary": "An AI-powered storytelling and presentation tool that generates complete slide decks with text, images, and layouts from a single prompt.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2020,
    "org": "Tome",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 for content + DALL·E for image generation)",
    "usage": "Visit tome.app, enter a prompt for your presentation topic, and Tome generates a full deck.",
    "benchmarks": "N/A",
    "limitations": "Limited design customization compared to traditional tools; export options are restricted.",
    "popular": true,
    "url": "https://tome.app",
    "citations": [
      {
        "text": "Tome",
        "url": "https://tome.app"
      }
    ]
  },
  {
    "name": "Gamma",
    "type": "AI",
    "summary": "An AI presentation and document builder that generates beautiful, shareable decks, webpages, and documents from text prompts or outlines in seconds.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2020,
    "org": "Gamma Tech",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 with proprietary layout and design generation engine)",
    "usage": "Visit gamma.app, describe your content, and generate a fully designed presentation instantly.",
    "benchmarks": "N/A",
    "limitations": "Free tier adds a Gamma watermark; advanced themes and AI credits require a paid plan.",
    "popular": true,
    "url": "https://gamma.app",
    "citations": [
      {
        "text": "Gamma",
        "url": "https://gamma.app"
      }
    ]
  },
  {
    "name": "Canva AI",
    "type": "AI",
    "summary": "A suite of AI-powered design tools inside Canva, including Magic Write for text generation, Magic Media for image creation, and one-click background removal.",
    "task": "Image Generation",
    "license": "Proprietary",
    "year": 2023,
    "org": "Canva",
    "size": "N/A",
    "architecture": "Web Application (Integrates Stable Diffusion, proprietary models, and third-party LLMs)",
    "usage": "Access at canva.com; AI tools are available within the design editor for all account types.",
    "benchmarks": "N/A",
    "limitations": "Advanced AI features require a Canva Pro subscription; image generation credits are limited.",
    "popular": true,
    "url": "https://www.canva.com/ai-image-generator",
    "citations": [
      {
        "text": "Canva Magic Studio",
        "url": "https://www.canva.com/magic-studio/"
      }
    ]
  },
  {
    "name": "Otter.ai",
    "type": "AI",
    "summary": "An AI meeting assistant that automatically transcribes, summarizes, and generates action items from voice conversations and meetings in real time.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2016,
    "org": "AISense Inc.",
    "size": "N/A",
    "architecture": "Web / Mobile Application (Proprietary ASR + NLP summarization pipeline)",
    "usage": "Visit otter.ai or install the mobile app; connect to Zoom, Google Meet, or MS Teams for auto-join.",
    "benchmarks": "N/A",
    "limitations": "Free tier limited to 300 minutes/month; accuracy drops with heavy accents or noisy audio.",
    "popular": true,
    "url": "https://otter.ai",
    "citations": [
      {
        "text": "Otter.ai",
        "url": "https://otter.ai"
      }
    ]
  },
  {
    "name": "Copilot for Microsoft 365",
    "type": "AI",
    "summary": "Microsoft's AI assistant embedded in Word, Excel, PowerPoint, Outlook, and Teams, helping users draft, summarize, and analyze within their daily M365 workflow.",
    "task": "Productivity",
    "license": "Proprietary",
    "year": 2023,
    "org": "Microsoft",
    "size": "N/A",
    "architecture": "SaaS Integration (Powered by GPT-4 with Microsoft Graph data grounding)",
    "usage": "Requires a Microsoft 365 subscription with a Copilot add-on; accessible within all M365 apps.",
    "benchmarks": "N/A",
    "limitations": "Expensive add-on ($30/user/month); quality depends heavily on organizational data quality.",
    "popular": true,
    "url": "https://www.microsoft.com/en-us/microsoft-365/copilot",
    "citations": [
      {
        "text": "Microsoft 365 Copilot",
        "url": "https://blogs.microsoft.com/blog/2023/03/16/introducing-microsoft-365-copilot-your-copilot-for-work/"
      }
    ]
  },
  {
    "name": "Khanmigo",
    "type": "AI",
    "summary": "An AI tutor by Khan Academy that guides students through topics using the Socratic method, asking questions rather than giving direct answers to encourage learning.",
    "task": "Education",
    "license": "Proprietary",
    "year": 2023,
    "org": "Khan Academy",
    "size": "N/A",
    "architecture": "Web Application (Powered by GPT-4 with educational fine-tuning and guardrails)",
    "usage": "Access at khanacademy.org; available to students and teachers with a Khan Academy account.",
    "benchmarks": "N/A",
    "limitations": "Requires a Khan Academy account; primarily focused on K-12 curriculum topics.",
    "popular": false,
    "url": "https://www.khanacademy.org/khan-labs",
    "citations": [
      {
        "text": "Khanmigo by Khan Academy",
        "url": "https://www.khanacademy.org/khan-labs"
      }
    ]
  },
  {
    "name": "Socratic by Google",
    "type": "AI",
    "summary": "A Google AI-powered learning app that helps students understand homework questions by providing explanations, videos, and step-by-step breakdowns from a photo scan.",
    "task": "Education",
    "license": "Proprietary",
    "year": 2017,
    "org": "Google",
    "size": "N/A",
    "architecture": "Mobile Application (Powered by Google Lens OCR + Google Search + LLM explanations)",
    "usage": "Download the Socratic app on iOS or Android and take a photo of any homework question.",
    "benchmarks": "N/A",
    "limitations": "Works best for standard K-12 subjects; may struggle with highly specialized or advanced topics.",
    "popular": true,
    "url": "https://socratic.org",
    "citations": [
      {
        "text": "Socratic by Google",
        "url": "https://socratic.org"
      }
    ]
  },
  {
    "name": "Duolingo Max",
    "type": "AI",
    "summary": "Duolingo's premium AI-powered tier featuring GPT-4 driven features like Explain My Answer for detailed feedback and Roleplay for open-ended AI conversation practice.",
    "task": "Education",
    "license": "Proprietary",
    "year": 2023,
    "org": "Duolingo",
    "size": "N/A",
    "architecture": "Mobile / Web Application (Powered by GPT-4 integrated into the Duolingo platform)",
    "usage": "Upgrade to Duolingo Max within the Duolingo iOS or Android app to access AI features.",
    "benchmarks": "N/A",
    "limitations": "Only available for select languages; requires a paid Max subscription on top of Duolingo Plus.",
    "popular": true,
    "url": "https://blog.duolingo.com/duolingo-max",
    "citations": [
      {
        "text": "Duolingo Max",
        "url": "https://blog.duolingo.com/duolingo-max"
      }
    ]
  },
  {
    "name": "Quizlet AI",
    "type": "AI",
    "summary": "Quizlet's AI-powered study assistant that generates practice questions, explains concepts, and personalizes study sets based on what a student is struggling with.",
    "task": "Education",
    "license": "Proprietary",
    "year": 2023,
    "org": "Quizlet",
    "size": "N/A",
    "architecture": "Web / Mobile Application (Powered by OpenAI GPT models with Quizlet's study data)",
    "usage": "Visit quizlet.com or open the app; Q-Chat and AI features are available on Quizlet Plus.",
    "benchmarks": "N/A",
    "limitations": "AI features require a Quizlet Plus subscription; AI-generated flashcards may contain errors.",
    "popular": true,
    "url": "https://quizlet.com/features/quizlet-ai",
    "citations": [
      {
        "text": "Quizlet AI",
        "url": "https://quizlet.com/features/quizlet-ai"
      }
    ]
  },
  {
    "name": "Elicit",
    "type": "AI",
    "summary": "An AI research assistant that searches and summarizes academic papers, extracts key data from studies, and helps researchers synthesize literature at scale.",
    "task": "Research",
    "license": "Proprietary",
    "year": 2021,
    "org": "Ought",
    "size": "N/A",
    "architecture": "Web Application (Powered by LLMs with semantic search over academic paper databases)",
    "usage": "Visit elicit.com, enter a research question, and get summaries and data from relevant papers.",
    "benchmarks": "N/A",
    "limitations": "Coverage limited to papers indexed in Semantic Scholar; may miss very recent publications.",
    "popular": false,
    "url": "https://elicit.com",
    "citations": [
      {
        "text": "Elicit",
        "url": "https://elicit.com"
      }
    ]
  },
  {
    "name": "Consensus",
    "type": "AI",
    "summary": "An AI-powered academic search engine that finds and synthesizes evidence from peer-reviewed research papers to answer scientific and factual questions.",
    "task": "Research",
    "license": "Proprietary",
    "year": 2022,
    "org": "Consensus",
    "size": "N/A",
    "architecture": "Web Application (Semantic search over 200M+ academic papers with LLM synthesis layer)",
    "usage": "Visit consensus.app, ask a research question, and get answers backed by peer-reviewed citations.",
    "benchmarks": "N/A",
    "limitations": "Limited to published academic research; GPT-4 powered summaries require a premium plan.",
    "popular": false,
    "url": "https://consensus.app",
    "citations": [
      {
        "text": "Consensus",
        "url": "https://consensus.app"
      }
    ]
  },
  {
    "name": "Semantic Scholar",
    "type": "AI",
    "summary": "A free AI-powered academic search engine by the Allen Institute for AI that provides smart paper recommendations, citation graphs, and TLDR summaries of research papers.",
    "task": "Research",
    "license": "Free",
    "year": 2015,
    "org": "Allen Institute for AI (AI2)",
    "size": "N/A",
    "architecture": "Web Application (Proprietary NLP models for paper summarization and semantic search)",
    "usage": "Visit semanticscholar.org to search for papers and access AI-generated summaries and citations.",
    "benchmarks": "N/A",
    "limitations": "TLDR summaries can oversimplify findings; coverage of non-English papers is limited.",
    "popular": false,
    "url": "https://www.semanticscholar.org",
    "citations": [
      {
        "text": "Semantic Scholar",
        "url": "https://www.semanticscholar.org"
      }
    ]
  },
  {
    "name": "Replika",
    "type": "AI",
    "summary": "An AI companion app designed for emotional support and personal conversation, allowing users to build a relationship with a customizable AI persona.",
    "task": "NLP",
    "license": "Proprietary",
    "year": 2017,
    "org": "Luka Inc.",
    "size": "N/A",
    "architecture": "Mobile / Web Application (Powered by custom fine-tuned LLMs)",
    "usage": "Download the Replika app on iOS or Android, or visit replika.com to chat with your AI companion.",
    "benchmarks": "N/A",
    "limitations": "Some features require a paid subscription; content policies changed significantly in 2023.",
    "popular": true,
    "url": "https://replika.com",
    "citations": [
      {
        "text": "Replika",
        "url": "https://replika.com"
      }
    ]
  },
  {
      "name": "DeepSeek-V4-Flash-Vision-Exp",
      "type": "Model",
      "summary": "High-performance Multimodal open-weights model by DeepSeek, trending with over 631 community likes and 184,542 downloads on Hugging Face.",
      "task": "Multimodal",
      "license": "MIT",
      "year": 2026,
      "org": "DeepSeek",
      "size": "Open Weights",
      "architecture": "DeepSeek image text to text architecture with community-tuned weights.",
      "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel = AutoModelForCausalLM.from_pretrained(\"deepseek-ai/DeepSeek-V4-Flash-Vision-Exp\", device_map=\"auto\")\ntokenizer = AutoTokenizer.from_pretrained(\"deepseek-ai/DeepSeek-V4-Flash-Vision-Exp\")",
      "benchmarks": "Trending Score: 582, Likes: 631, Downloads: 184,542",
      "limitations": "Requires GPU VRAM or quantization for efficient local deployment.",
      "popular": true,
      "url": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp",
      "citations": [
          {
              "text": "deepseek-ai/DeepSeek-V4-Flash-Vision-Exp on Hugging Face",
              "url": "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp"
          }
      ]
  },
  {
      "name": "Qwen3.8-27B",
      "type": "Model",
      "summary": "High-performance Multimodal open-weights model by Alibaba (Qwen), trending with over 14,038 community likes and 6,024,467 downloads on Hugging Face.",
      "task": "Multimodal",
      "license": "APACHE-2.0",
      "year": 2026,
      "org": "Alibaba (Qwen)",
      "size": "27B params",
      "architecture": "Alibaba (Qwen) image text to text architecture with community-tuned weights.",
      "usage": "from transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel = AutoModelForCausalLM.from_pretrained(\"Qwen/Qwen3.8-27B\", device_map=\"auto\")\ntokenizer = AutoTokenizer.from_pretrained(\"Qwen/Qwen3.8-27B\")",
      "benchmarks": "Trending Score: 536, Likes: 14,038, Downloads: 6,024,467",
      "limitations": "Requires GPU VRAM or quantization for efficient local deployment.",
      "popular": true,
      "url": "https://huggingface.co/Qwen/Qwen3.8-27B",
      "citations": [
          {
              "text": "Qwen/Qwen3.8-27B on Hugging Face",
              "url": "https://huggingface.co/Qwen/Qwen3.8-27B"
          }
      ]
  }
];

export const typeFilters = ["All", "AI", "Framework", "Dataset", "Platform", "Model"];
export const taskFilters = [
  "All Tasks", "NLP", "Computer Vision", "MLOps", "Audio", "Multimodal",
  "AI Coding", "Image Generation", "Video Generation", 
  "Productivity", "Education", "Research"
];
