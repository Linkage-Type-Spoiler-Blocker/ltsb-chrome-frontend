export function extractFullText(){
    let fullText = "";
    let articles = document.getElementsByTagName("article");
    // console.log(document.body.textContent);

    //TODO article이 아니라 다른 방법 생각하기.
    Array.from(articles).forEach(article => fullText = fullText.concat(article.innerText));

    return fullText
}