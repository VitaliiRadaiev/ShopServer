import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import express, { Express } from 'express';
import { Server, createServer } from 'http';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import ws, { WebSocketServer } from 'ws';
import { TYPES } from './types';
import { PrismaService } from './database/prisma.service';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IConfigService } from './config/config.service.interface';
import { UsersController } from './users/users.controller';
import { BasketController } from './basket/basket.controller';
import { ProductCardsController } from './productCards/productCards.controller';
import { CategoriesController } from './categories/categories.controller';
import { WishListController } from './wishList/wishList.controller';
import { LastViewedProductsController } from './lastViewedProducts/lastViewedProducts.controller';
import { ProductCommentsController } from './productComments/productComments.controller';
import { FiltersController } from './filters/filters.controller';
import { HistoryController } from './history/history.controller';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;
    wss: WebSocketServer;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter, 
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
        @inject(TYPES.ConfigService) private configService: IConfigService,  
        @inject(TYPES.UsersController) private usersController: UsersController,  
        @inject(TYPES.BasketController) private basketController: BasketController,  
        @inject(TYPES.ProductCardsController) private productCardsController: ProductCardsController,  
        @inject(TYPES.CategoriesController) private categoriesController: CategoriesController,  
        @inject(TYPES.WishListController) private wishListController: WishListController,  
        @inject(TYPES.LastViewedProductsController) private lastViewedProductsController: LastViewedProductsController,  
        @inject(TYPES.ProductCommentsController) private productCommentsController: ProductCommentsController,  
        @inject(TYPES.FiltersController) private filtersController: FiltersController,  
        @inject(TYPES.HistoryController) private historyController: HistoryController,  
    ) {
        this.app = express();
        this.port = 8001;
        this.server = createServer(this.app);
    }

    private useMiddleware(): void {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(fileUpload({}));
    }

    private useRoutes(): void {
        this.app.use('/api/users', this.usersController.router);
        this.app.use('/api/basket', this.basketController.router);
        this.app.use('/api/products', this.productCardsController.router);
        this.app.use('/api/categories', this.categoriesController.router);
        this.app.use('/api/wishlist', this.wishListController.router);
        this.app.use('/api/lastViewedProducts', this.lastViewedProductsController.router);
        this.app.use('/api/comments', this.productCommentsController.router);
        this.app.use('/api/filters', this.filtersController.router);
        this.app.use('/api/history', this.historyController.router);
    }

    private useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter)); 
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.useRoutes();
        this.useExeptionFilters();
        this.app.use((req, res, next) => {
            res.sendFile(path.join(path.join(__dirname, 'public', 'index.html')));
        });
        await this.prismaService.connect();
        this.server.listen(this.port);
        console.log('Server is running on ' + this.configService.get('HOST'));
    }
}