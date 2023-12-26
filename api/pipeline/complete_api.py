import os
from ctransformers import AutoModelForCausalLM, AutoConfig
from dataclasses import dataclass,asdict

@dataclass
class GenerationConfig:
    temperature: float
    top_k: int
    top_p: float
    repetition_penalty: float
    max_new_tokens: int
    seed: int
    reset: bool
    stream: bool
    threads: int
    stop: list

class ModelsPath:
    CODE_GEN_MODEL = "./models/autocomplete/WizardCoder-1B-V1.0-ggml-q4_1.bin"


class CodeGen:
    MAX_LENGTH = 2048

    def __init__(self):
        self.model = None

    def format_prompt(self, user_prompt: str):
        prompt = "### Instruction:\n"
        prompt += f"{user_prompt}\n\n"
        prompt += "### Response:\n"
        config_attributes = [attr for attr in dir(GenerationConfig) if not attr.startswith("__")]
        for attr in config_attributes:
            value = getattr(GenerationConfig, attr)
            prompt += f"{attr}: {value}\n"
        return prompt

    # GENERATE WORD WITH TIMEOUT_CONDITION
    def generate(self,llm: AutoModelForCausalLM,generation_config: GenerationConfig,user_prompt:str):
        return llm(
            user_prompt,
            **asdict(generation_config)
        )
    
    def initliaze_model(self):
        if self.model is None:
            config = AutoConfig.from_pretrained(os.path.abspath("./models"),context_length=self.MAX_LENGTH)
            self.model = AutoModelForCausalLM.from_pretrained(
                ModelsPath.CODE_GEN_MODEL,
                model_type="starcoder",
                config=config
            )

    def infer(self,user_prompt:str):
        self.initliaze_model()
        generation_config = GenerationConfig(
            temperature=0.2,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.0,
            max_new_tokens=512,  # adjust as needed
            seed=42,
            reset=True,  # reset history (cache)
            stream=True,  # streaming per word/token
            threads=int(os.cpu_count() / 6),  # adjust for your CPU
            stop=["<|endoftext|>"],
        )
        gen_word = self.generate(self.model,generation_config,user_prompt.strip())

        return gen_word

    def __iter__(self):
        if not self.model:
            raise StopIteration
        else:
            for word in self.model:
                yield  word

if __name__ == '__main__':
    try:
        code_gen = CodeGen()
        gen_word = code_gen.infer("def fibonacci(")
        for word in gen_word:
            print(word,end="",flush=True)
        print("")
    except Exception as e:
        print(e)