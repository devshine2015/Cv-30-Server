module.exports = {
    cleanHeaderName: name => name.replace(/\$/ig, '-').replace(/\./ig, '--').replace(/\//ig, '---').toLowerCase()
}