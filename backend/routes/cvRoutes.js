const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cvController = require('./../controllers/cvController');

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: Gestion des CVs
 */

/**
 * @swagger
 * /cv:
 *   get:
 *     summary: Récupérer tous les CVs
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: Une liste de tous les CVs
 *       400:
 *         description: Erreur lors de la récupération des CVs
 */
router.get('/', cvController.allCv);

/**
 * @swagger
 * /cv/create:
 *   post:
 *     summary: Créer un nouveau CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               description:
 *                 type: string
 *               experiencesPeda:
 *                 type: array
 *                 items:
 *                   type: string
 *               experiencesPro:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: CV créé avec succès
 *       400:
 *         description: Erreur lors de la création du CV
 */
router.post('/create', authMiddleware, cvController.createCv);

/**
 * @swagger
 * /cv/my-cvs:
 *   get:
 *     summary: Récupérer les CVs de l'utilisateur connecté
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste de CVs de l'utilisateur
 *       400:
 *         description: Erreur lors de la récupération des CVs de l'utilisateur
 */
router.get('/my-cvs', authMiddleware, cvController.cvByUser);

/**
 * @swagger
 * /cv/update/{id}:
 *   put:
 *     summary: Mettre à jour un CV par ID
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du CV à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               description:
 *                 type: string
 *               experiencesPeda:
 *                 type: array
 *                 items:
 *                   type: string
 *               experiencesPro:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: CV mis à jour avec succès
 *       400:
 *         description: Erreur lors de la mise à jour du CV
 *       404:
 *         description: CV non trouvé
 */
router.put('/update/:id', authMiddleware, cvController.updateCv);

/**
 * @swagger
 * /cv/update/{id}/recommendation:
 *   put:
 *     summary: Ajouter une recommandation à un CV par ID
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du CV pour lequel ajouter une recommandation
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recommandation ajoutée avec succès
 *       400:
 *         description: Erreur lors de l'ajout de la recommandation
 *       404:
 *         description: CV non trouvé
 *       403:
 *         description: Accès refusé (vous ne pouvez pas recommander votre propre CV)
 */
router.put('/update/:id/recommendation', authMiddleware, cvController.recommendationCv);

/**
 * @swagger
 * /cv/{id}:
 *   get:
 *     summary: Récupérer un CV par ID
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du CV à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV récupéré avec succès
 *       404:
 *         description: CV non trouvé
 *       403:
 *         description: Accès refusé (vous n'êtes pas le propriétaire de ce CV)
 */
router.get('/:id', authMiddleware, cvController.getCvById);

/**
 * @swagger
 * /cv/delete/{id}:
 *   delete:
 *     summary: Supprimer un CV par ID
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du CV à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CV supprimé avec succès
 *       404:
 *         description: CV non trouvé
 */
router.delete('/delete/:id', authMiddleware, cvController.deleteCv);

module.exports = router;
