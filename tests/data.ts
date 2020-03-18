// コレクションパス
export const collectionPath = "books";
 
// 商品管理者
export const adminUser = "tanaka";
 
// 商品ID
export const itemId = "XXXXXXXXXX";
 
// 発売日
const releaseDate = new Date('2000-01-01 00:00:00');
 
// 初期データ
export const initialData = {
    id: itemId,
    title: "銀河鉄道の朝",
    description: "人間か機械か、勝つのはどっちだ！",
    releaseDate: releaseDate,
    price: 2500,
    stock: 6,
    condition: "new",
    adminUsers: [adminUser, "yamada"],
    draft: false
};
 
// 更新用データ
export const validUpdateData = {
    id: itemId,
    title: "北風と太平洋",
    description: "北風と太平洋、勝つのはどっちだ！",
    releaseDate: releaseDate,
    price: 30000,
    stock: 6,
    condition: "used",
    adminUsers: [adminUser, "yamada"],
    draft: false
};