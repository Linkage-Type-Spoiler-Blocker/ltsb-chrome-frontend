// const regTxt = '(http(s)?:\\/\\/.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)'
const regTxt = '(http(s)?:\\/\\/.)?(www\\.)?([-a-zA-Z0-9@:%_\\+~#=]{2,63}\\.){1,127}[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]{0,5})';
const targetURLs = [];
const testRegexes1 = [];
const testRegexes2 = [];

targetURLs.push("blog.naver.com");
targetURLs.push("www.google.co.kr");
targetURLs.push("https://www.hashcode.co.kr");
testRegexes1.push(regTxt);
testRegexes2.push(regTxt);

function isMatchedToRegex(regex, targetURL){
    let re = new RegExp(regex);
    let result = re.test(targetURL);
    console.log(targetURL);
    console.log(result);
    return result;
}

function isExcludedSites(firstRegexes, secondRegexes, targetURL){
    if(firstRegexes.some(curRegex=>isMatchedToRegex(curRegex, targetURL))||
        secondRegexes.some(curRegex=>isMatchedToRegex(curRegex, targetURL))){
        return true;
    }
    else{
        return false;
    }
}

targetURLs.forEach(targetURL=>isExcludedSites(testRegexes1, testRegexes2, targetURL));
