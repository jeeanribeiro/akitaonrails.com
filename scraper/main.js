const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const pretty = require('pretty');

const SITE_URL = 'https://www.akitaonrails.com/';
const CONTENT_DIR = '../content/posts';

async function getDocumentElementFromUrl(url) {
    try {
        const response = await fetch(url);
        const htmlString = await response.text();

        const dom = new JSDOM(htmlString);
        const document = dom.window.document;
        return document
    } catch (error) {
        console.error('Error fetching and parsing HTML:', error);
    }
}

async function getPostsUrlsFromHome() {
    const doc = await getDocumentElementFromUrl(SITE_URL);
    return Array.from(doc.querySelectorAll('.post-title')).map(post => post.parentElement.href);
}

async function getPostFromUrl(postUrl) {
    console.log(`Processing post: ${postUrl}`);
    const doc = await getDocumentElementFromUrl(SITE_URL.substring(0, SITE_URL.length - 1) + postUrl);
    const title = doc.querySelector('.post-title h3').textContent;
    const content = doc.querySelector('.content div.excerpt').innerHTML.trim() + doc.querySelector('.content div.text').innerHTML.trim();
    const contentWithoutTagsElement = content.replace(/<h4[^>]*>(.*?)<\/h4>\s*$/, '');
    const prettyContent = pretty(contentWithoutTagsElement, { ocd: true });
    const decodedUrl = decodeURIComponent(getUrlPath(postUrl));
    const tagsElement = Array.from(doc.querySelectorAll('h4')).at(-2)
    const tags = Array.from(tagsElement.querySelectorAll('a')).slice(1)?.map(tagElement => tagElement.textContent) ?? []
    const datetime = doc.querySelector('.post-title h4').textContent;
    const date = new Date(datetime.replace(' h', ''));
    const isoDate = date.toISOString();
    return { title, content: prettyContent, date: isoDate, filename: `${decodedUrl}.md`, tags, year: date.getFullYear().toString()};
}

function getUrlPath(url) {
    const pathArray = url.split('/');
    const path = pathArray.at(-1);
    return path
}

function createMarkdownFileFromPost(post) {
    const { title, content, date, filename, tags, year } = post;

    const yearDir = path.join(CONTENT_DIR, year);
    if (!fs.existsSync(yearDir)) {
        fs.mkdirSync(yearDir, { recursive: true });
    }

    const markdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
years: "${year}"
---

${content}`;
    const filePath = path.join(CONTENT_DIR, year, filename);
    fs.writeFileSync(filePath, markdownContent);
    console.log(`File created: ${filePath}`);
}

function createFileForEachPostUrl(postUrls) {
    postUrls.forEach(async postUrl => {
        const post = await getPostFromUrl(postUrl);
        createMarkdownFileFromPost(post);
    });
}

async function initialize() {
    const postUrls = await getPostsUrlsFromHome();
    createFileForEachPostUrl(postUrls);
}

void initialize()
