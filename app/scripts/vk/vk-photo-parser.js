function parse(attachments, smallPhotoRequiredSize) {
    return (attachments || []).filter((скрепа) => {
        return скрепа.type === 'photo';
    }).map((photoAttachment) => {
        let photo = photoAttachment.photo;
        let photoSizes = Object.keys(photo).filter((key) => {
            return key.startsWith('photo_');
        }).map((key) => {
            return parseInt(key.replace('photo_', ''));
        }).sort();

        let bigPhotoSize = photoSizes[photoSizes.length - 1];

        let smallPhotoSize = bigPhotoSize;
        for (let i = photoSizes.length - 1; i >= 0; i--) {
            if (photoSizes[i] <= smallPhotoRequiredSize) { smallPhotoSize = photoSizes[i]; }
        }

        return {
            id: photo.id,
            date: photo.date,
            smallURL: photo['photo_' + smallPhotoSize],
            bigURL: photo['photo_' + bigPhotoSize]
        }
    });
}

module.exports = {
    parse: parse
};
