import { Router } from 'express';
import multer from 'multer';
import configs from '../configs';
import { sql } from 'slonik';
import pgDBPoolUtitlities from '../configs/db';

const { sqlOne } = configs.pgDBPoolUtitlities.queryVariants;

export const imageBaseUrl = '/api/images';

const imageRouter = Router();

const uploadInMemory = multer();

imageRouter.post('/upload', uploadInMemory.single('my_test_image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, mimetype, buffer } = req.file;

        console.log('{ originalname, mimetype, buffer }', { originalname, mimetype, buffer });

        const result = await sqlOne`
            INSERT INTO images (filename, mime_type, data)
            VALUES (${originalname}, ${mimetype}, ${sql.binary(buffer)})
            RETURNING id
        `;

        res.status(201).json({ message: 'Image uploaded', id: result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
});


imageRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const image = await pgDBPoolUtitlities.getPGDBPool()!.one(sql.unsafe`
            SELECT filename, data
            FROM images
            WHERE id = ${Number(id)};
        `);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'inline');
        res.end(image.data); // res.send() triggered download instead of inline rendering on browser for some reason...

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Download failed' });
    }
});

export default imageRouter;



/*

curl -X POST -F "my_test_image=@/Users/mdimranpavel/Desktop/Grumpy Cat.jpg" http://localhost:3000/api/images/upload

*/