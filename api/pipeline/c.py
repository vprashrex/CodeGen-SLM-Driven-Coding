from ctransformers import AutoModelForCausalLM
import os
# Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
llm = AutoModelForCausalLM.from_pretrained(os.path.abspath("models/instruct/instruct-Q8_0.gguf"), model_type="deepseek")

print(llm("AI is going to"))
