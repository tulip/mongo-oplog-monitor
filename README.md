Mongo Oplog Monitor
====================

Mongo Oplog Monitor provides two things:

1) A live view into the writes happening inside your mongo cluster, formatted
   for easy scanning.

2) A summary of the size and number of updates across all collections and
   databases over a given time period.

Use it to debug Mongo performance issues, examine traffic spikes, or optimize
your app's use of Mongo.

Usage
====================

```
npm install -g mongo-oplog-monitor
mongo-oplog-monitor mongodb://localhost
```

Example Output
====================

```
bsw@muktuk:mongo-oplog-monitor $ ./index.js  mongodb://192.168.50.100
Oplog monitoring started. Entries will be printed here. Press ctrl+c to exit and print a summary.
[2017-04-13 00:14:29] [factory.ServerProcesses       ] u {"$set":{"heartbeat":1492042469726}} {"_id":"p8zjFrK6v8Lpvv42c"}
[2017-04-13 00:14:34] [factory.Analyses              ] u {"$set":{"cacheUpdateAttemptStarted":1492042474835,"cacheUpdaterId":"qXLrYCupjyTA9SZdJ"}} {"_id":"AoK5wDQJSKuckrtA2"}
[2017-04-13 00:14:34] [factory.Analyses              ] u {"$set":{"cacheUpdateAttemptStarted":1492042474874,"cacheUpdaterId":"7y8k8s5pb5hBmnsWx"}} {"_id":"HLu56kPf5vcQZpSek"}
[2017-04-13 00:14:34] [factory.Analyses              ] u {"$set":{"cacheUpdateAttemptStarted":1492042474911,"cacheUpdaterId":"FQXsN9owR268BSvLg"}} {"_id":"NxeuP8x46RbmT4h7F"}
[2017-04-13 00:14:34] [factory.Analyses              ] u {"$set":{"cacheUpdateAttemptStarted":1492042474948,"cacheUpdaterId":"fWxMakEkoL3ErxeH5"}} {"_id":"yLj39W5Wh9ZGR4PZX"}
[2017-04-13 00:14:35] [factory.Analyses              ] u {"$set":{"cacheUpdated":1492042475022,"cacheUpdateStarted":1492042474874,"cachedResult":{"command... {"_id":"HLu56kPf5vcQZpSek"}
[2017-04-13 00:14:35] [factory.Analyses              ] u {"$set":{"cacheUpdated":1492042475047,"cacheUpdateStarted":1492042474911},"$unset":{"cacheUpdateA... {"_id":"NxeuP8x46RbmT4h7F"}
[2017-04-13 00:14:35] [factory.Analyses              ] u {"$set":{"cacheUpdated":1492042475160,"cacheUpdateStarted":1492042474948,"cachedResult":{"command... {"_id":"yLj39W5Wh9ZGR4PZX"}
[2017-04-13 00:14:35] [factory.Analyses              ] u {"$set":{"cacheUpdated":1492042475913,"cacheUpdateStarted":1492042474835,"cachedResult":{"command... {"_id":"AoK5wDQJSKuckrtA2"}
^CExiting due to interrupt
By Database
┌────────────────────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Table                                  │ Oplog Traffic           │ Number of Updates       │
├────────────────────────────────────────┼─────────────────────────┼─────────────────────────┤
│ factory.Analyses                       │ 23.033 KB               │ 8                       │
├────────────────────────────────────────┼─────────────────────────┼─────────────────────────┤
│ factory.ServerProcesses                │ 63 Bytes                │ 1                       │
└────────────────────────────────────────┴─────────────────────────┴─────────────────────────┘



Across Databases
┌────────────────────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Table                                  │ Oplog Traffic           │ Number of Updates       │
├────────────────────────────────────────┼─────────────────────────┼─────────────────────────┤
│ Analyses                               │ 23.033 KB               │ 8                       │
├────────────────────────────────────────┼─────────────────────────┼─────────────────────────┤
│ ServerProcesses                        │ 63 Bytes                │ 1                       │
└────────────────────────────────────────┴─────────────────────────┴─────────────────────────┘
```

License
====================

mongo-oplog-monitor is licensed under the [Apache Public License](LICENSE).


Who's Behind It
====================

Mongo Oplog Monitor is maintained by Tulip. Tulip is transforming manufacturing processes by bringing the latest technological advances from the lab to the shop floor. Whereas most factories are still using state of the art technology from the mid 19th century, we come from the future to bring them a rich, realtime web app, modern tablets, IoT systems, in-depth analytics, and more.

We do web development (with Meteor+React+Redux), IoT/embedded software, computer vision, data engineering, technical operations / DevOps, web-based UI design, and anything else we need to make the best product possible. Sound interesting? Email us at jobs@tulip.co.
