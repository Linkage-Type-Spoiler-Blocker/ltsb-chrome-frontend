
import {extractFullText} from "./statement_extractor.js";

var userOptions;
var cur_url;
var wordsPerMovie;
var fullWords=[];

function loadOptions(callback){
    //TODO 단어도 불러오려면 둘중 하나는 기다려야함.
    return new Promise((resolve,reject)=>{
        chrome.runtime.sendMessage({msg_type : "get"}, (options)=>{
            resolve(options);
        });
    });
}

function concatWords(){
    fullWords.push(...userOptions.userWordsToBeBlocked);
    wordsPerMovie.forEach((curMovie)=>{
        fullWords.push(...curMovie.words);
    });
    console.log(fullWords);
}

function getCurrentURL(){
    return new Promise((resolve,reject)=>{
        chrome.runtime.sendMessage({msg_type : "get_url"}, (curURL)=>{
            resolve(curURL);
        });
    });
}

function isBlockingEnabled(){
    if(userOptions.isBlockingEnabled == true) {
        return true;
    }
    else{
        return false;
    }
}

function isMatchedToRegex(regex, targetURL){

    let re = new RegExp(regex);
    let result = re.test(targetURL);
    console.log(result)
    return result;
}

function isSubString(smallString, bigString){
    if(bigString.indexOf(smallString)>-1){
        return true
    }
    else{
        return false
    }
}

function isExcludedSites(firstRegexes, secondRegexes, targetURL){
    console.log(userOptions.tempExcludedSites);
    if(firstRegexes.some(curRegex=>isSubString(curRegex, targetURL))||
        secondRegexes.some(curRegex=>isSubString(curRegex, targetURL))){
        return true;
    }
    else{
        return false;
    }
}

export async function main(){
    // TODO 비동기랑 동기가 섞여있음에 유의할것. 적어도 load options 후에 다른것들이 수행되어야 할거같은데?
    //기본적으로 자바스크립트 함수가 동기인가? 비동기인가? 함수앞에 명시해야할때가 언제?
    userOptions = await loadOptions();
    cur_url = await getCurrentURL();
    if(isExcludedSites(userOptions.excludedSites, userOptions.tempExcludedSites, cur_url)){
        console.log("제외사이트");
        return;
    }
    else{
        window.addEventListener('DOMContentLoaded', function () {
            enableMutationObserver();
        });
        chrome.runtime.sendMessage({msg_type : "get_words"}, (words)=>{
            wordsPerMovie = words;

            concatWords();

            blockSpoilerContent(document, fullWords, "[스포일러 포함]");
        });
    }
}

//TODO 여기부터가 차단 코드


let cachedTerms = ["어벤져스"];
const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6";
const containerElements = "span, div, li, th, td, dt, dd";

function blockSpoilerContent(rootNode, spoilerTerms, blockText) {
    let nodes = rootNode.querySelectorAll(elementsWithTextContentToSearch)
    replacenodesWithMatchingText(nodes, spoilerTerms, blockText);

    nodes = findContainersWithTextInside(rootNode);
    if (nodes && nodes.length !== 0) {
        replacenodesWithMatchingText(nodes, spoilerTerms, blockText);
    }
}

function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
    nodes = Array.from(nodes);
    nodes.reverse();
    for (const node of nodes) {
        for (const spoilerTerm of spoilerTerms) {
            if (compareForSpoiler(node, spoilerTerm)) {
                if (!node.parentNode || node.parentNode.nodeName === "BODY") {
                    continue;
                }
                node.className += " hidden-spoiler";
                node.textContent = replaceString;
                blurNearestChildrenImages(node);
            }
        }
    }
}

function compareForSpoiler(nodeToCheck, spoilerTerm) {
    const regex = new RegExp(spoilerTerm, "i");
    return regex.test(nodeToCheck.textContent);
}

function blurNearestChildrenImages(nodeToCheck) {
    let nextParent = nodeToCheck;
    let childImages;
    const maxIterations = 3;
    let iterationCount = 0;
    do {
        nextParent = nextParent.parentNode;
        if (nextParent && nextParent.nodeName !== "BODY") {
            childImages = nextParent.parentNode.querySelectorAll('img');
        }
        iterationCount++;
    } while (nextParent && childImages.length === 0 && iterationCount < maxIterations)

    if (childImages && childImages.length > 0) {
        for (const image of childImages) {
            image.className += " blacked-out";
        }
    }
}

function findContainersWithTextInside(targetNode) {
    const containerNodes = targetNode.querySelectorAll(containerElements);
    const emptyNodes = [];
    for (const containerNode of containerNodes) {
        const containerChildren = containerNode.childNodes;
        for (const containerChild of containerChildren) {
            if (containerChild.textContent) {
                emptyNodes.push(containerChild.parentNode);
            }
        }
    }
    return emptyNodes;
}

function applyBlurCSSToMatchingImages(nodes, spoilerTerms) {
    for (const node of nodes) {
        for (const spoilerTerm of spoilerTerms) {
            const regex = new RegExp(spoilerTerm, "i");
            if (regex.test(node.title) || regex.test(node.alt ||
                regex.test(node.src) || regex.test(node.name))) {
                node.className += " blurred";
                node.parentNode.style.overflow = "hidden";
            }
        }
    }
}

function enableMutationObserver() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    const observer = new MutationObserver((mutations, observer) => {
        for (const mutation of mutations) {
            blockSpoilerContent(mutation.target, fullWords, "[스포일러 포함]");
        }
    });

    const config = { attributes: true, subtree: true }
    observer.observe(document, config);
}