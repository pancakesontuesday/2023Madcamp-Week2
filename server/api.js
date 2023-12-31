const getSecret = require("./getSecret.js");

const { MongoClient } = require("mongodb");

// MongoDB 서버 URL
// 이거 허용된 ip에서만 실행해야 함
data = getSecret.getSecret("url.json");
const url = data.db;


// db.collection을 배열로 다 불러옴
async function getAll(dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    let dataArr = {};
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find({}).toArray();
        console.log(data);
        dataArr = JSON.stringify(data);
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
    return dataArr;
}

// db.collection에서 "username"이 target인 객체를 불러옴
async function getOneByName(target, dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    var data = {};
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.findOne({ username: target });

        if (result) {
            console.log("일치하는 객체:", result);
            data = JSON.stringify(result);
        } else {
            console.log("일치하는 객체를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
    return data;
}

// db.collection에서 id를 받고 그 id의 username을 리턴, 없으면 null 리턴
async function postOneById(id, dbName, collectionName) {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
  
    const user = await collection.findOne({ id: id });
    
    console.log("일치하는 객체:", user);
    client.close();
  
    return user ? JSON.stringify(user) : null;
  }

// obj를 db.collection에 추가
async function insertOne(
    id,
    username,
    univ,
    bestScore,
    dbName,
    collectionName
) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        var obj = {
            id: id,
            username: username,
            univ: univ,
            bestScore: bestScore,
        };

        const result = await collection.insertOne(obj);
        console.log(
            `데이터가 성공적으로 삽입되었습니다. ID: ${result.insertedId}`
        );
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
}

// "username"이 target과 같으면 삭제 (1개만)
async function deleteOneByName(target, dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ username: target });

        if (result.deletedCount > 0) {
            console.log(
                `삭제 완료: ${result.deletedCount}개의 문서가 삭제되었습니다.`
            );
        } else {
            console.log(`삭제 실패: 일치하는 문서를 찾을 수 없습니다.`);
        }
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
}

// name의 bestScore를 newScore로 업데이트
async function updateBestScoreByName(name, newScore, dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.findOne({ username: name });

        if (result) {
            result.bestScore = newScore;
            await collection.replaceOne({ _id: result._id }, result);
            console.log("객체 업데이트 완료:", result);
        } else {
            console.log("일치하는 객체를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
}

// id의 bestScore를 newScore로 업데이트
async function updateBestScoreById(id, newScore, dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.findOne({ id: id });

        if (result) {
            result.bestScore = newScore;
            await collection.replaceOne({ _id: result._id }, result);
            console.log("객체 업데이트 완료:", result);
        } else {
            console.log("일치하는 객체를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
}

// sort by bestScore
async function sortByBestScore(dbName, collectionName) {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const sort = { bestScore: -1 }; // -1 for descending order, 1 for ascending

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find({}).sort(sort).toArray();

        console.log(data);
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생:", error);
    } finally {
        await client.close();
    }
}



module.exports = {
    getAll,
    getOneByName,
    insertOne,
    deleteOneByName,
    updateBestScoreByName,
    updateBestScoreById,
    sortByBestScore,
    postOneById
}

// test
var dbName = "RankDB";
var collectionName = "users";

// getAll(dbName, collectionName);
// console.log("\n");

sortByBestScore(dbName, collectionName);
console.log("\n");

// setTimeout(function() {
//   insertOne("John", "pic3", 400, dbName, collectionName);
//   console.log("\n");
// }, 2000);

// setTimeout(function() {
//   updateBestScoreByName("John", 500, dbName, collectionName);
//   console.log("\n");
// }, 3000);

// setTimeout(function() {
//   getOneByName("John", dbName, collectionName);`
//   console.log("\n");
// }, 4000);

// setTimeout(function() {
//   deleteOneByName("John", dbName, collectionName);
//   console.log("\n");
// }, 5000);

// setTimeout(function() {
//   getAll(dbName, collectionName);
//   console.log("\n");
// }, 6000);
