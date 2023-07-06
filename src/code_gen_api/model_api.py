import os
from ctransformers import AutoModelForCausalLM,AutoConfig
from dataclasses import dataclass,asdict
from dotenv import load_dotenv


class ModelsPath:
    CODE_GEN_MODEL = "../../models/replit-v2-codeinstruct-3b.q4_1.bin"


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
    stop: list[str]
    MAX_LENGTH = 2048


class CodeGen():
    def __init__(self) -> None:
        super().__init__()

    def format_prompt(self,user_prompt: str):
        return f"""### Instruction
            {user_prompt}
        ### Response:"""

    def generate(
        self,
        llm: AutoModelForCausalLM,
        generation_config: GenerationConfig,
        user_prompt:str):

        """run model inference, will return a Generator if streaming is true"""
        
        return llm(
            self.format_prompt(user_prompt),
            **asdict(generation_config)
        )

    def infer(self):
        config = AutoConfig.from_pretrained(
            os.path.abspath("../../models"),
            context_length = GenerationConfig.MAX_LENGTH
        )

        llm = AutoModelForCausalLM.from_pretrained(
            ModelsPath.CODE_GEN_MODEL,
            model_type="replit",
            config=config
        )

        generation_config = GenerationConfig(
            temperature=0.2,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.0,
            max_new_tokens=512,
            seed=42,
            reset=True,
            stream=True,
            threads=int(os.cpu_count() / 6),
            stop=["<|endoftext|>"],
        )

        user_prefix = "[user]: "
        assistant_prefix = f"[assistant]:"

        while True:
            user_prompt = input(user_prefix)
            generator = self.generate(llm,generation_config,user_prompt.strip())
            print(assistant_prefix,end=" ",flush=True)
            for word in generator:
                print(word,end="",flush=True)
            print("")


if __name__ == '__main__':
    r = CodeGen()
    r.infer()
    