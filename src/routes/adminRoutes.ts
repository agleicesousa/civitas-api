import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permissaoAdminMiddleware } from '../middlewares/permissaoAdminMiddleware';
import { Membros } from '../entities/membrosEntities';

const adminRouter = Router();
const adminController = new AdminController();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Admin created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
adminRouter.post(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.criarAdmin(req, res, next)
);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: List all admins
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of admins.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   example: 1
 *                   nullable: true
 *                   description: Only shown when there are admins to list
 *       401:
 *         description: Unauthorized.
 */
adminRouter.get(
  '/',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.listarAdmins(req, res, next)
);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Admin ID
 *           example: 1
 *     responses:
 *       200:
 *         description: Admin details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *       404:
 *         description: Admin not found.
 *       401:
 *         description: Unauthorized.
 */
adminRouter.get(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.buscarAdminPorId(req, res, next)
);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Update admin by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Admin ID
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               password:
 *                 type: string
 *                 example: "newpassword"
 *     responses:
 *       200:
 *         description: Admin updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe Updated
 *                 email:
 *                   type: string
 *                   example: updated@example.com
 *       404:
 *         description: Admin not found.
 *       401:
 *         description: Unauthorized.
 */
adminRouter.put(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.atualizarAdmin(req, res, next)
);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Admin ID
 *           example: 1
 *     responses:
 *       200:
 *         description: Admin deleted successfully.
 *       404:
 *         description: Admin not found.
 *       401:
 *         description: Unauthorized.
 */
adminRouter.delete(
  '/:id',
  authMiddleware,
  permissaoAdminMiddleware(Membros, 'Membro'),
  (req, res, next) => adminController.deletarAdmin(req, res, next)
);

export default adminRouter;
