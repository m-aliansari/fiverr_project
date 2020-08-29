function generateMarkdown(data) {
  return `<em><img src="${data.prof_pic}" height="150px" width="150px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <img src="https://img.shields.io/badge/${data.badgeLabel}-${data.badgeMessage}-${data.badgeColor}" alt="badge" width="400px" height="120px"></em>
  # ${data.title}
  -------------------------
  ## Description
  #### ${data.description}. 
  ## Contact
  #### ${data.email}
  ## License
  #### ${data.license}
  ## Contributing
  ${data.contributing}
  ## Installation
  \`\`\`
    ${data.installation}
  \`\`\`
  ## Usage
  \`\`\`
    ${data.usage}
  \`\`\`
  ## Test
  \`\`\`
    ${data.test}
  \`\`\`
`;
}

module.exports = generateMarkdown;
