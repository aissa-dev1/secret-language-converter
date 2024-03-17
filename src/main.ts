import { toEnglishLangRules, toSecretLangRules } from "./constants";
import { Languages } from "./types";
import lower from "./utils/lower";

const inputLanguageBtns = document.querySelectorAll<HTMLButtonElement>(".i-language-btn");
const outputLanguageBtns = document.querySelectorAll<HTMLButtonElement>(".o-language-btn");
const convertTextInput = document.querySelector<HTMLInputElement>("#convert_text_input")!;
const convertedTextElm = document.querySelector("#converted_text_elm")!;
const copyConvertedTextBtn = document.querySelector("#copy_converted_text_btn")!;
const toHelpPageBtns = document.querySelectorAll(".to-help-page");
const toConvertPageBtns = document.querySelectorAll(".to-convert-page");

let convertLanguage: Languages = "Secret";
let currentPage = "convert_page";

document.addEventListener("DOMContentLoaded", () => {
  updatePage();
  activateLanguageBtn(inputLanguageBtns, outputLanguageBtns);
  activateLanguageBtn(outputLanguageBtns, inputLanguageBtns);
});

inputLanguageBtns.forEach((ilb) => {
  ilb.addEventListener("click", () => {
    convertTextInput.value = "";
    convertedTextElm.textContent = "Hello world!";

    outputLanguageBtns.forEach((olb) => {
      if (ilb.dataset.language !== olb.dataset.language) {
        convertLanguage = olb.dataset.language as Languages;
      }
    });
  });
});

outputLanguageBtns.forEach((olb) => {
  olb.addEventListener("click", () => {
    convertLanguage = olb.dataset.language as Languages;

    convertTextInput.value = "";
    convertedTextElm.textContent = "Hello world!";
  });
});

toHelpPageBtns.forEach((thpb) => {
  thpb.addEventListener("click", () => changePage("help_page"));
});

toConvertPageBtns.forEach((tcpb) => {
  tcpb.addEventListener("click", () => changePage("convert_page"));
});

convertTextInput.addEventListener("input", handleConvertTextInput);

copyConvertedTextBtn.addEventListener("click", copyConvertedText);

function charConverter(char: string, to: Languages): string {
  if (to === "English") {
    return toEnglishLangRules[char];
  }

  return toSecretLangRules[char];
}

function textConverter(text: string, to: Languages): string {
  const joinedText = lower(text.split(" ").join("/"));
  let allowedCharacters: string[] = [];

  let convertedText = "";

  if (to === "Secret") {
    allowedCharacters = [" ", ...Object.keys(toSecretLangRules).filter((char) => char !== "/")];

    for (let i = 0; i < lower(text).length; i++) {
      if (allowedCharacters.includes(lower(text)[i])) {
        continue;
      } else {
        convertedText = "Waiting for changes in the English language!";

        return convertedText;
      }
    }

    for (let i = 0; i < joinedText.length; i++) {
      if (joinedText[i] === "/") {
        convertedText += charConverter(joinedText[i], to);
        continue;
      }

      if (i !== 0 && joinedText[i - 1] !== "/") {
        convertedText += "-";
      }

      convertedText += charConverter(joinedText[i], to);
    }

    return convertedText;
  }

  allowedCharacters = ["-", "^", ...Object.values(toSecretLangRules)];

  for (let i = 0; i < lower(text).length; i++) {
    if (allowedCharacters.includes(lower(text)[i])) {
      continue;
    } else {
      convertedText = "Waiting for changes in the Secret language!";

      return convertedText;
    }
  }

  for (let i = 0; i < joinedText.length; i++) {
    if (joinedText[i] === "^") {
      if (joinedText.length < 3) {
        convertedText = "Waiting for changes in the Secret language!";

        return convertedText;
      }

      convertedText += charConverter(`${joinedText[i]}${joinedText[i + 1]}${joinedText[i + 2]}`, to);

      i += 2;
      continue;
    }

    convertedText += charConverter(joinedText[i], to);
  }

  return convertedText;
}

function activateLanguageBtn(albs: NodeListOf<HTMLButtonElement>, blbs: NodeListOf<HTMLButtonElement>) {
  albs.forEach((alb) => {
    alb.addEventListener("click", () => {
      albs.forEach((alb) => alb.classList.remove("active"));
      blbs.forEach((blb) => blb.classList.remove("active"));

      alb.classList.add("active");

      blbs.forEach((blb) => {
        if (blb.dataset.language !== alb.dataset.language) {
          blb.classList.add("active");
        }
      });
    });
  });
}

function handleConvertTextInput() {
  if (convertTextInput.value.length <= 0) {
    convertedTextElm.textContent = "Hello world!";
    return;
  }

  const convertedText = textConverter(convertTextInput.value, convertLanguage);

  if (convertedText.includes("undefined")) {
    convertedTextElm.textContent = "Still waiting for changes...";
    return;
  }

  convertedTextElm.textContent = convertedText;
}

function copyConvertedText() {
  const textArea = document.createElement("textarea");

  textArea.value = convertedTextElm.textContent as string;

  document.body.appendChild(textArea);

  textArea.select();

  document.execCommand("copy");

  document.body.removeChild(textArea);
}

function changePage(page: string) {
  currentPage = page;

  updatePage();
}

function updatePage() {
  const pages = document.querySelectorAll(".page");
  const convertPage = document.querySelector(".convert-page")!;
  const helpPage = document.querySelector(".help-page")!;

  pages.forEach((page) => page.classList.add("hidden"));

  switch (currentPage) {
    case "convert_page":
      convertPage.classList.remove("hidden");
      break;

    case "help_page":
      helpPage.classList.remove("hidden");
      break;

    default:
      convertPage.classList.remove("hidden");
      break;
  }
}
