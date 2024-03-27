import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { PrismaService } from "./database/prisma.service";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import { ExeptionFilter } from "./errors/exeption.filter";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { UsersController } from "./users/users.controller";
import { UsersServices } from "./users/users.services";
import { BasketController } from "./basket/basket.controller";
import { BasketServices } from "./basket/basket.services";
import { ProductCardsController } from "./productCards/productCards.controller";
import { ProductCardsServices } from "./productCards/productCards.services";
import { CategoriesController } from "./categories/categories.controller";
import { CategoriesServices } from "./categories/categories.services";
import { WishListController } from "./wishList/wishList.controller";
import { WishListServices } from "./wishList/wishList.services";
import { LastViewedProductsController } from "./lastViewedProducts/lastViewedProducts.controller";
import { LastViewedProductsServices } from "./lastViewedProducts/lastViewedProducts.services";
import { ProductCommentsController } from "./productComments/productComments.controller";
import { ProductCommentsServices } from "./productComments/productComments.services";
import { FiltersController } from "./filters/filters.controller";
import { FiltersServices } from "./filters/filters.services";
import { HistoryController } from "./history/history.controller";
import { HistoryServices } from "./history/history.services";

export interface IBootstrapReturn {
    appContainer: Container,
    app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<App>(TYPES.Application).to(App);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter).inRequestScope();
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inRequestScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inRequestScope();
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inRequestScope();
    bind<UsersController>(TYPES.UsersController).to(UsersController).inRequestScope();
    bind<UsersServices>(TYPES.UsersServices).to(UsersServices).inRequestScope();
    bind<BasketController>(TYPES.BasketController).to(BasketController).inRequestScope();
    bind<BasketServices>(TYPES.BasketServices).to(BasketServices).inRequestScope();
    bind<ProductCardsController>(TYPES.ProductCardsController).to(ProductCardsController).inRequestScope();
    bind<ProductCardsServices>(TYPES.ProductCardsServices).to(ProductCardsServices).inRequestScope();
    bind<CategoriesController>(TYPES.CategoriesController).to(CategoriesController).inRequestScope();
    bind<CategoriesServices>(TYPES.CategoriesServices).to(CategoriesServices).inRequestScope();
    bind<WishListController>(TYPES.WishListController).to(WishListController).inRequestScope();
    bind<WishListServices>(TYPES.WishListServices).to(WishListServices).inRequestScope();
    bind<LastViewedProductsController>(TYPES.LastViewedProductsController).to(LastViewedProductsController).inRequestScope();
    bind<LastViewedProductsServices>(TYPES.LastViewedProductsServices).to(LastViewedProductsServices).inRequestScope();
    bind<ProductCommentsController>(TYPES.ProductCommentsController).to(ProductCommentsController).inRequestScope();
    bind<ProductCommentsServices>(TYPES.ProductCommentsServices).to(ProductCommentsServices).inRequestScope();
    bind<FiltersController>(TYPES.FiltersController).to(FiltersController).inRequestScope();
    bind<FiltersServices>(TYPES.FiltersServices).to(FiltersServices).inRequestScope();
    bind<HistoryController>(TYPES.HistoryController).to(HistoryController).inRequestScope();
    bind<HistoryServices>(TYPES.HistoryServices).to(HistoryServices).inRequestScope();
})

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings);

    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { appContainer, app };
}

export const { appContainer, app } = bootstrap();