// Firestoreエミュレータのホストとポートを指定
process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";
 
import {FirestoreTestSupporter} from "firestore-test-supporter";
 
import * as path from "path";
import * as firebase from "@firebase/testing";
 
// テストデータの読み込み
import {collectionPath, adminUser, itemId, initialData} from "./data";
 
describe("書籍データの追加テスト", () => {
    const supporter = new FirestoreTestSupporter("my-test-project", path.join(__dirname, "firestore.rules"));
 
    beforeEach(async () => {
        // セキュリティルールの読み込み
        await supporter.loadRules();
    });
 
    afterEach(async () => {
        // データのクリーンアップ
        await supporter.cleanup()
    });
 
    test('要件にあったデータの追加に成功', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertSucceeds(doc.set(initialData))
    });
 
    test('データ追加をリクエストしたユーザが商品管理者でない場合は追加不可', async () => {
        // 非商品管理者で認証されたクライアントを取得
        const db = supporter.getFirestoreWithAuth("non_admin_user");
        
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertFails(doc.set(initialData))
    });
 
    test('データのサイズが9でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // データサイズが追加対象外であるデータを作成
        const badData = {...initialData, author: "Hosoda"};
 
        await firebase.assertFails(doc.set(badData))
    });
 
    test('タイトルがstring型でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // タイトルの型が追加対象外であるデータを作成
        const badData = {...initialData, title: 5};
 
        await firebase.assertFails(doc.set(badData))
    });
 
    test('書籍詳細がstring型でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // 書籍詳細の型が追加対象外であるデータを作成
        const badData = {...initialData, description: true};
 
        await firebase.assertFails(doc.set(badData))
    });
 
    test('出版日がtimestamp型でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // 出版日の型が追加対象外であるデータを作成
        const badData = {...initialData, releaseDate: "yesterday"};
 
        await firebase.assertFails(doc.set(badData))
    });
 
    test('価格がint型で0以上でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // 価格の型が追加対象外であるデータを作成
        const badData1 = {...initialData, price: "二千"};
 
        await firebase.assertFails(doc.set(badData1));
 
        // 価格の値が追加対象外であるデータを作成
        const badData2 = {...initialData, price: -1};
 
        await firebase.assertFails(doc.set(badData2))
    });
 
    test('在庫がint型で0以上でない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // 在庫数の型が追加対象外であるデータを作成
        const badData1 = {...initialData, stock: "4"};
 
        await firebase.assertFails(doc.set(badData1));
 
        // 在庫数の値が追加対象外であるデータを作成
        const badData2 = {...initialData, stock: -1};
 
        await firebase.assertFails(doc.set(badData2))
    });
 
    test('状態がnew, usedのいずれかでない場合は追加不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        // 状態の値が追加対象外であるデータを作成
        const badData = {...initialData, condition: "old"};
 
        await firebase.assertFails(doc.set(badData))
    });
});