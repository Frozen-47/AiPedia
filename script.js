const entries = [
    {
        name: "GPT-4",
        type: "Model",
        summary: "Advanced large language model with multimodal capabilities for text and image understanding.",
        task: "NLP",
        license: "Proprietary",
        year: 2023,
        org: "OpenAI",
        size: "Unknown (estimated 1.76T params)",
        architecture: "Transformer-based decoder architecture with advanced reasoning capabilities.",
        usage: `from openai import OpenAI\nclient = OpenAI()\nresponse = client.chat.completions.create(\n  model="gpt-4",\n  messages=[{"role": "user", "content": "Hello!"}]\n)`,
        benchmarks: "MMLU: 86.4%, HumanEval: 67%",
        limitations: "Can hallucinate, expensive to run, proprietary with limited access.",
        url: "https://openai.com/gpt-4",
        citations: [
            { text: "Official GPT-4 Technical Report", url: "https://openai.com/research/gpt-4" },
            { text: "GPT-4 API Documentation", url: "https://platform.openai.com/docs" }
        ]
    },
    {
        name: "BERT",
        type: "Model",
        summary: "Bidirectional Encoder Representations from Transformers for NLP pre-training.",
        task: "NLP",
        license: "Apache-2.0",
        year: 2018,
        org: "Google",
        size: "Base: 110M params, Large: 340M params",
        architecture: "Transformer encoder with bidirectional attention, pre-trained with masked language modeling.",
        usage: `from transformers import BertTokenizer, BertModel\ntokenizer = BertTokenizer.from_pretrained('bert-base-uncased')\nmodel = BertModel.from_pretrained('bert-base-uncased')`,
        benchmarks: "GLUE: 80.5% (base), SQuAD: 93.2 F1",
        limitations: "Limited to 512 tokens, slower than newer models.",
        url: "https://github.com/google-research/bert",
        citations: [
            { text: "Devlin et al. (2018) - BERT Paper", url: "https://arxiv.org/abs/1810.04805" },
            { text: "Official GitHub Repository", url: "https://github.com/google-research/bert" }
        ]
    },
    {
        name: "Stable Diffusion",
        type: "Model",
        summary: "Open-source latent diffusion model for high-quality text-to-image generation.",
        task: "Computer Vision",
        license: "CreativeML Open RAIL-M",
        year: 2022,
        org: "Stability AI",
        size: "890M params",
        architecture: "Latent diffusion model with CLIP text encoder and U-Net denoising network.",
        usage: `from diffusers import StableDiffusionPipeline\npipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2")\nimage = pipe("a photo of an astronaut on mars").images[0]`,
        benchmarks: "FID score competitive with DALL-E 2",
        limitations: "Can produce biased outputs, requires GPU for reasonable speed.",
        url: "https://stability.ai/stable-diffusion",
        citations: [
            { text: "Rombach et al. (2022) - Latent Diffusion Paper", url: "https://arxiv.org/abs/2112.10752" },
            { text: "Stability AI Official Site", url: "https://stability.ai" }
        ]
    },
    {
        name: "PyTorch",
        type: "Framework",
        summary: "Open-source machine learning framework with dynamic computation graphs.",
        task: "MLOps",
        license: "BSD-3-Clause",
        year: 2016,
        org: "Meta AI",
        size: "N/A",
        architecture: "Python-first framework with automatic differentiation and GPU acceleration.",
        usage: `import torch\nimport torch.nn as nn\nmodel = nn.Sequential(\n  nn.Linear(10, 20),\n  nn.ReLU(),\n  nn.Linear(20, 1)\n)`,
        benchmarks: "Most popular framework for research (60%+ papers)",
        limitations: "More verbose than high-level frameworks, deployment can be complex.",
        url: "https://pytorch.org",
        citations: [
            { text: "PyTorch Official Documentation", url: "https://pytorch.org/docs" },
            { text: "GitHub Repository", url: "https://github.com/pytorch/pytorch" }
        ]
    },
    {
        name: "ImageNet",
        type: "Dataset",
        summary: "Large-scale image dataset with 14M+ images across 20K+ categories.",
        task: "Computer Vision",
        license: "Various (academic use)",
        year: 2009,
        org: "Stanford / Princeton",
        size: "14M images, 150GB",
        architecture: "Hierarchical organization based on WordNet, 1000 classes for ILSVRC.",
        usage: `from torchvision.datasets import ImageNet\ndataset = ImageNet(root='./data', split='train')`,
        benchmarks: "Standard benchmark for computer vision (ImageNet-1K)",
        limitations: "Some labeling issues, Western-centric bias.",
        url: "https://image-net.org",
        citations: [
            { text: "Deng et al. (2009) - ImageNet Paper", url: "https://ieeexplore.ieee.org/document/5206848" },
            { text: "Official ImageNet Website", url: "https://image-net.org" }
        ]
    },
    {
        name: "Hugging Face",
        type: "Platform",
        summary: "Open platform for sharing and collaborating on ML models, datasets, and applications.",
        task: "MLOps",
        license: "Apache-2.0 (libraries)",
        year: 2016,
        org: "Hugging Face Inc.",
        size: "500K+ models hosted",
        architecture: "Cloud platform with transformers library, model hub, and deployment tools.",
        usage: `from transformers import pipeline\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love this!")`,
        benchmarks: "Most popular model hub with 10M+ monthly users",
        limitations: "Free tier has rate limits, some models require authentication.",
        url: "https://huggingface.co",
        citations: [
            { text: "Hugging Face Documentation", url: "https://huggingface.co/docs" },
            { text: "Transformers Library", url: "https://github.com/huggingface/transformers" }
        ]
    },
    {
        name: "CLIP",
        type: "Model",
        summary: "Contrastive Language-Image Pre-training for zero-shot image classification.",
        task: "Computer Vision",
        license: "MIT",
        year: 2021,
        org: "OpenAI",
        size: "ViT-L/14: 428M params",
        architecture: "Dual encoder with vision transformer and text transformer trained contrastively.",
        usage: `import clip\nmodel, preprocess = clip.load("ViT-B/32")\nimage = preprocess(image).unsqueeze(0)\ntext = clip.tokenize(["a cat", "a dog"])`,
        benchmarks: "Zero-shot ImageNet: 76.2% top-1",
        limitations: "Struggles with fine-grained classification, abstract concepts.",
        url: "https://github.com/openai/CLIP",
        citations: [
            { text: "Radford et al. (2021) - CLIP Paper", url: "https://arxiv.org/abs/2103.00020" },
            { text: "Official CLIP Repository", url: "https://github.com/openai/CLIP" }
        ]
    },
    {
        name: "LLaMA",
        type: "Model",
        summary: "Open foundation language models from 7B to 70B parameters.",
        task: "NLP",
        license: "LLaMA License (non-commercial)",
        year: 2023,
        org: "Meta AI",
        size: "7B to 70B params",
        architecture: "Transformer decoder with optimizations for efficiency.",
        usage: `from transformers import LlamaForCausalLM, LlamaTokenizer\nmodel = LlamaForCausalLM.from_pretrained("meta-llama/Llama-2-7b")\ntokenizer = LlamaTokenizer.from_pretrained("meta-llama/Llama-2-7b")`,
        benchmarks: "70B model competitive with GPT-3.5 on many tasks",
        limitations: "Restricted commercial use, requires significant compute.",
        url: "https://ai.meta.com/llama/",
        citations: [
            { text: "Touvron et al. (2023) - LLaMA Paper", url: "https://arxiv.org/abs/2302.13971" },
            { text: "Meta AI Official LLaMA Page", url: "https://ai.meta.com/llama/" }
        ]
    }
];

const typeFilters = ["All", "Model", "Framework", "Dataset", "Platform"];
const taskFilters = ["All Tasks", "NLP", "Computer Vision", "MLOps"];

let currentFilter = "All";
let currentTask = "All Tasks";
let searchQuery = "";

function initFilters() {
    const filtersContainer = document.getElementById('filters');
    
    typeFilters.forEach(filter => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (filter === 'All' ? ' active' : '');
        btn.textContent = filter;
        btn.onclick = () => setFilter(filter, 'type');
        filtersContainer.appendChild(btn);
    });

    taskFilters.forEach(task => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (task === 'All Tasks' ? ' active' : '');
        btn.textContent = task;
        btn.onclick = () => setFilter(task, 'task');
        filtersContainer.appendChild(btn);
    });
}

function setFilter(filter, filterType) {
    if (filterType === 'type') {
        currentFilter = filter;
    } else {
        currentTask = filter;
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent === filter) {
            btn.classList.add('active');
        } else if ((filterType === 'type' && typeFilters.includes(btn.textContent)) ||
                   (filterType === 'task' && taskFilters.includes(btn.textContent))) {
            btn.classList.remove('active');
        }
    });

    renderEntries();
}

function filterEntries() {
    return entries.filter(entry => {
        const matchesType = currentFilter === 'All' || entry.type === currentFilter;
        const matchesTask = currentTask === 'All Tasks' || entry.task === currentTask;
        const matchesSearch = searchQuery === '' || 
            entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.org.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesType && matchesTask && matchesSearch;
    });
}

function renderEntries() {
    const grid = document.getElementById('entriesGrid');
    const noResults = document.getElementById('noResults');
    const filtered = filterEntries();

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = '';

    filtered.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.onclick = () => showDetail(entry);
        
        card.innerHTML = `
            <div class="entry-header">
                <div>
                    <div class="entry-title">${entry.name}</div>
                </div>
                <div class="entry-type">${entry.type}</div>
            </div>
            <div class="entry-summary">${entry.summary}</div>
            <div class="entry-meta">
                <span class="meta-tag">${entry.task}</span>
                <span class="meta-tag">${entry.license}</span>
                <span class="meta-tag">${entry.year}</span>
            </div>
            <div class="entry-footer">
                <span>${entry.org}</span>
                <span>${entry.size}</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function showDetail(entry) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">${entry.name}</div>
            <div class="entry-meta">
                <span class="meta-tag">${entry.type}</span>
                <span class="meta-tag">${entry.task}</span>
                <span class="meta-tag">${entry.license}</span>
                <span class="meta-tag">${entry.year}</span>
            </div>
        </div>

        <div class="modal-section">
            <h3>Overview</h3>
            <p>${entry.summary}</p>
        </div>

        <div class="modal-section">
            <h3>Details</h3>
            <ul>
                <li><strong>Organization:</strong> ${entry.org}</li>
                <li><strong>Size:</strong> ${entry.size}</li>
                <li><strong>License:</strong> ${entry.license}</li>
                <li><strong>Official URL:</strong> <a href="${entry.url}" target="_blank" style="color: #f0f6fc;">${entry.url}</a></li>
            </ul>
        </div>

        <div class="modal-section">
            <h3>Architecture</h3>
            <p>${entry.architecture}</p>
        </div>

        <div class="modal-section">
            <h3>Example Usage</h3>
            <div class="code-block">${entry.usage}</div>
        </div>

        <div class="modal-section">
            <h3>Performance</h3>
            <p>${entry.benchmarks}</p>
        </div>

        <div class="modal-section">
            <h3>Limitations</h3>
            <p>${entry.limitations}</p>
        </div>

        <div class="modal-section">
            <h3>Citations & References</h3>
            <p style="margin-bottom: 0.75rem;">All information is summarized in our own words from the following sources:</p>
            ${entry.citations.map(cite => `<a href="${cite.url}" target="_blank" class="citation-badge">${cite.text} ↗</a>`).join('')}
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function showAddModal() {
    alert('Add Entry feature: In a full implementation, this would open a form to submit new entries for community review.');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderEntries();
});

document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeModal();
    }
});

initFilters();
renderEntries();