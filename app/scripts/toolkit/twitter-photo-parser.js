function parse(medias) {
    return (medias || []).filter((entity) => {
        return entity.type === 'photo'
    }).map((photoEntity) => {
        return {
            id: photoEntity.id_str,
            date: null,
            smallURL: photoEntity.media_url + ':small',
            bigURL: photoEntity.media_url
        }
    });
}

module.exports = {
    parse: parse
};
