const express = require('express');
const inflection = require('inflection');
const multer = require('multer');

const router = express.Router({
	mergeParams: true,
});

module.exports = (app) => {
	router.post('/', async (req, res) => {
		const model = await req.Model.create(req.body);
		res.send(model);
	});

	router.get('/', async (req, res) => {
		let queryOptions = {};
		if (req.Model.modelName === 'Category') {
			queryOptions.populate = 'parent';
		}
		const model = await req.Model.find(req.body).setOptions(queryOptions);
		res.send(model);
	});

	router.get('/:id', async (req, res) => {
		const model = await req.Model.findById(req.params.id);
		res.send(model);
	});

	router.put('/:id', async (req, res) => {
		const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
		res.send(model);
	});

	router.delete('/:id', async (req, res) => {
		await req.Model.findByIdAndDelete(req.params.id, req.body);
		res.send({ success: true });
	});

	const setModel = (req, res, next) => {
		const resource = inflection.classify(req.params.resource);
		req.Model = require(`../../models/${resource}`);
		next();
	};

	app.use('/admin/api/rest/:resource', setModel, router);

	const upload = multer({
		dest: __dirname + '/../../uploads',
	});
	app.post('/admin/api/upload', upload.single('file'), (req, res) => {
		const file = req.file;
		file.url = `http://localhost:3000/uploads/${file.filename}`;
		res.send(file);
	});
};
