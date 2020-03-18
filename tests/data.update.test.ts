process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";
 
import {FirestoreTestSupporter} from "firestore-test-supporter";
 
import * as path from "path";
import * as firebase from "@firebase/testing";
 
import {collectionPath, adminUser, itemId, initialData, validUpdateData} from "./data";
 
describe("書籍データの更新テスト", () => {
    const supporter = new FirestoreTestSupporter("my-test-project", path.join(__dirname, "firestore.rules"));
 
    beforeEach(async () => {
        await supporter.loadRules();
 
        // 初期データを追加
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertSucceeds(doc.set(initialData))
    });
 
    afterEach(async () => {
        await supporter.cleanup()
    });
 
    test('要件にあったデータの更新に成功', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertSucceeds(doc.update(validUpdateData))
    });
 
    test('データ更新をリクエストしたユーザが商品管理者でない場合は更新不可', async () => {
        // 商品管理者を変更するリクエストデータを用意
        const tunedValidUpdateData = {...validUpdateData, adminUsers: ["new_admin_user"]};
 
        // データベース上のデータの商品管理者にリクエストユーザがいない場合の更新不可チェック
        const db1 = supporter.getFirestoreWithAuth("new_admin_user");
        const doc1 = db1.collection(collectionPath).doc(itemId);
 
        await firebase.assertFails(doc1.update(tunedValidUpdateData))
 
        // データベース上のデータの商品管理者にリクエストユーザがいる場合の商品管理者の更新成功チェック
        const db2 = supporter.getFirestoreWithAuth(adminUser);
        const doc2 = db2.collection(collectionPath).doc(itemId);
 
        await firebase.assertSucceeds(doc2.update(tunedValidUpdateData))
    });
 
    test('データのサイズが9でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData = {...validUpdateData, author: "Hosoda"};
        await firebase.assertFails(doc.update(badData))
    });
 
    test('タイトルがstring型でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData = {...validUpdateData, title: 5};
        await firebase.assertFails(doc.update(badData))
    });
 
    test('書籍詳細がstring型でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData = {...validUpdateData, description: true};
        await firebase.assertFails(doc.update(badData))
    });
 
    test('出版日がtimestamp型でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData = {...validUpdateData, releaseDate: "yesterday"};
        await firebase.assertFails(doc.update(badData))
    });
 
    test('価格がint型で0以上でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData1 = {...validUpdateData, price: "二千"};
        await firebase.assertFails(doc.update(badData1));
 
        const badData2 = {...validUpdateData, price: -1};
        await firebase.assertFails(doc.update(badData2))
    });
 
    test('在庫がint型で0以上でない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData1 = {...validUpdateData, stock: "4"};
        await firebase.assertFails(doc.update(badData1));
 
        const badData2 = {...validUpdateData, stock: -1};
        await firebase.assertFails(doc.update(badData2))
    });
 
    test('状態がnew, usedのいずれかでない場合は更新不可', async () => {
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
 
        const badData = {...validUpdateData, condition: "old"};
        await firebase.assertFails(doc.update(badData))
    });
});