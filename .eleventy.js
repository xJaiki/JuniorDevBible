const markdownIt = require('markdown-it');
const { createHighlighter } = require('shiki');
const { fromHighlighter } = require('@shikijs/markdown-it');

module.exports = async function(eleventyConfig) {
    const highlighter = await createHighlighter({
        themes: ['one-dark-pro'],
        langs: [
            'java', 'javascript', 'typescript',
            'bash', 'shell', 'sql', 'html', 'css',
            'json', 'yaml', 'http', 'xml', 'text'
        ]
    });

    const md = markdownIt({ html: true, linkify: true, typographer: true });
    md.use(fromHighlighter(highlighter, { theme: 'one-dark-pro', fallbackLanguage: 'text' }));
    eleventyConfig.setLibrary('md', md);

    eleventyConfig.addCollection("chapters", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/chapters/*.md").sort((a, b) => a.date - b.date);
    });

    // Pass through CSS (includes compiled Tailwind output)
    eleventyConfig.addPassthroughCopy("src/css");
    // Pass through favicon/images
    eleventyConfig.addPassthroughCopy({ "img": "img" });

    return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
