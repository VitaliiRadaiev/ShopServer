export interface ICreateProductCardData {
    title: string;
    price: number;
    oldPrice: number;
    isNew: boolean;
    inStock: boolean;
    isPromotion: boolean;
    isBestseller: boolean;
    isRecommended: boolean;
    shortDescription: string;
    description: string;
    categoryId: string;
    filters: string[];
}

export type IUpdateProductCardData = Partial<ICreateProductCardData>;

export interface IUploadImage {
    url: string;
}

export interface IGetProductsBody { 
    filters?: IFilter[]; 
    priceRange?: { from: number, to: number };
    sortBy?: 'cheap' | 'expensive' | 'rank';
    isNew?: boolean;
    inStock?: boolean;
    isPromotion?: boolean;
    isBestseller?: boolean;
    isRecommended?: boolean;
    count?: number;
    page?: number;
    term?: string;
    categoryId?: string;
}

interface IFilter {
    id: string;
    items: string[]
}
