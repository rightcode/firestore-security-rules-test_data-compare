process.env.FIRESTORE_EMULATOR_HOST = "localhost:58080";
 
import { FirestoreTestSupporter } from "firestore-test-supporter";
 
import * as path from "path";
import * as firebase from "@firebase/testing";
 
import { collectionPath, adminUser, itemId, initialData, validUpdateData } from "./data";
 
describe("書籍データの取得テスト", () => {
    const supporter = new FirestoreTestSupporter("my-test-project", path.join(__dirname, "firestore.rules"));
 
    beforeEach(async () => {
        await supporter.loadRules();
 
        const db = supporter.getFirestoreWithAuth(adminUser);
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertSucceeds(doc.set(initialData))
    });
 
    afterEach(async () => {
        await supporter.cleanup()
    });
 
    test('要件にあったデータの取得に成功', async () => {
        // 認証なしクライアントの取得
        const db = supporter.getFirestore();
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertSucceeds(doc.get())
    });
 
    test('下書きデータの取得不可', async () => {
        // テスト対象データの下書きフラグをtrueに変更
        const dbWithAdmin = supporter.getFirestoreWithAuth(adminUser);
        const docWithAdmin = dbWithAdmin.collection(collectionPath).doc(itemId);
        const newData = { ...validUpdateData, draft: true };
        await firebase.assertSucceeds(docWithAdmin.set(newData));
 
        const db = supporter.getFirestore();
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertFails(doc.get())
    });
 
    test('在庫が5以下の書籍の取得不可', async () => {
        // テスト対象データの在庫数を取得対象外の値に変更
        const dbWithAdmin = supporter.getFirestoreWithAuth(adminUser);
        const docWithAdmin = dbWithAdmin.collection(collectionPath).doc(itemId);
        const newData = { ...validUpdateData, stock: 5 };
        await firebase.assertSucceeds(docWithAdmin.set(newData));
 
        const db = supporter.getFirestore();
        const doc = db.collection(collectionPath).doc(itemId);
        await firebase.assertFails(doc.get())
    });
});