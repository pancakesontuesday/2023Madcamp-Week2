using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Newtonsoft.Json;

public class PassHandler : MonoBehaviour
{
    public UserScriptObject user;

    public UrlObject URL;

    // Android에서 Unity object로 ID를 불러옴 -> 불러온 Id로 모든 정보를 불러옴
    public void PassId(string id) {
        var url = string.Format("{0}/{1}", URL.host, URL.urlPostById);
        Debug.Log(url);

        var req = new Protocols.Packets.req_PostById();
        req.id = id;
        var json = JsonConvert.SerializeObject(req);
        Debug.Log(json);

        StartCoroutine(RankMain.PostScoreById(url, json, (raw) =>
        {
            _User res = JsonConvert.DeserializeObject<_User>(raw);
            Debug.LogFormat("Post Result: {0} : {1}", res.username, res.bestScore);

            user.id = id;
            user.username = res.username;
            user.univ = res.univ;
            user.bestScore = res.bestScore;
        }));
    }

    // Host부터 보내고 Unity 시작할 것
    public void PassHost(string host) {
        URL.host = host;
        Debug.LogFormat("Host passed: {0}", host);
    }

    
}
