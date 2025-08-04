var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// DynamoDB table name
export var TABLE_NAME = process.env.TABLE_NAME || "portfolio-items";
export var client = new DynamoDBClient({});
export var ddbDocClient = DynamoDBDocumentClient.from(client);
export var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var project, queryCmd, queryResult, highestId, putCmd, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!event.body) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({ error: "Missing request body" }),
                        }];
                }
                project = (typeof (event.body) == 'object') ? event.body : JSON.parse(event.body);
                if (!(project.id === 0)) return [3 /*break*/, 2];
                queryCmd = new QueryCommand({
                    TableName: TABLE_NAME,
                    KeyConditionExpression: "#type = :typeVal",
                    ExpressionAttributeNames: { "#type": "type", "#id": "id" },
                    ExpressionAttributeValues: { ":typeVal": project.type },
                    ProjectionExpression: "#id",
                    ScanIndexForward: false, // descending order
                    Limit: 1,
                });
                return [4 /*yield*/, ddbDocClient.send(queryCmd)];
            case 1:
                queryResult = _a.sent();
                highestId = queryResult.Items && queryResult.Items.length > 0
                    ? queryResult.Items[0].id
                    : 0;
                project.id = highestId + 1;
                _a.label = 2;
            case 2:
                putCmd = new PutCommand({
                    TableName: TABLE_NAME,
                    Item: project,
                });
                return [4 /*yield*/, ddbDocClient.send(putCmd)];
            case 3:
                _a.sent();
                console.log("Succes: Proj Saved");
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Project saved", project: project }),
                    }];
            case 4:
                error_1 = _a.sent();
                return [2 /*return*/, {
                        statusCode: 500,
                        body: JSON.stringify({ error: error_1.message || "Internal server error" }),
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); };
