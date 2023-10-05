if [ ! $1 ]
then
    echo "pas de token" 
else
    clear
    echo "GET users/me"
    curl  -s http://localhost:3000/users/me -H "Accept: application/json" -H "Authorization: Bearer $1" | jq
    echo ""

    echo "GET users/search '"$USER"'"
    curl  -s http://localhost:3000/users/search -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET -d '{"search": "'"$USER"'"}' | jq
    echo ""

    echo "GET users/search bad param "
    curl  -s http://localhost:3000/users/search -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET -d '{"search": "eghjbvlisefjbgiuetrhblkjdsfovuygfsohb"}' | jq
    echo ""

    echo "POST users/addup_relation target_id 2 status friend "
    curl  -s http://localhost:3000/users/addup_relation -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST -d '{"target_id": 2, "status": "FRIEND"}' | jq
    echo ""

    echo "POST users/addup_relation target_id 2 status bad "
    curl  -s http://localhost:3000/users/addup_relation -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST -d '{"target_id": 2, "status": "bad"}' | jq
    echo ""

    echo "GET users/status_relations target_id 2 "
    curl  -s http://localhost:3000/users/status_relation -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET -d '{"target_id": 2}' | jq
    echo ""

    echo "GET users/get_friend "
    curl  -s http://localhost:3000/users/get_friend -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET  | jq
    echo ""

    echo "POST users/addup_relation target_id 2 status blocked "
    curl  -s http://localhost:3000/users/addup_relation -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST -d '{"target_id": 2, "status": "BLOCKED"}' | jq
    echo ""

    echo "GET users/status_relations target_id 2 "
    curl  -s http://localhost:3000/users/status_relation -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET -d '{"target_id": 2}' | jq
    echo ""

    echo "GET users/get_friend "
    curl  -s http://localhost:3000/users/get_friend -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET  | jq
    echo ""

    echo "POST users/update_name coucou"
    curl  -s http://localhost:3000/users/update_name -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST -d '{"name": "coucou"}' | jq
    echo ""

    echo "GET users/me"
    curl  -s http://localhost:3000/users/me -H "Accept: application/json" -H "Authorization: Bearer $1" | jq
    echo ""

    echo "GET users/get_class"
    curl  -s http://localhost:3000/users/get_class -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channels"
    curl  -s http://localhost:3000/chat/channels -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "POST chat/channel/create tester public"
    curl  -s http://localhost:3000/chat/channel/create -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST -d '{"name": "tester","privacy":"PUBLIC"}' | jq
    echo ""

    echo "GET chat/channels"
    curl  -s http://localhost:3000/chat/channels -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channels/joined"
    curl  -s http://localhost:3000/chat/channels/joined -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "DELETE chat/channel/leave/1"
    curl  -s http://localhost:3000/chat/channel/leave/1 -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X DELETE | jq
    echo ""

    echo "GET chat/channels/joined"
    curl  -s http://localhost:3000/chat/channels/joined -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "POST chat/channel/join/1"
    curl  -s http://localhost:3000/chat/channel/join/1 -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST  | jq
    echo ""

    echo "POST chat/channel/join/abc"
    curl  -s http://localhost:3000/chat/channel/join/abc -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X POST  | jq
    echo ""

    echo "GET chat/channels/joined"
    curl  -s http://localhost:3000/chat/channels/joined -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channel/?search=test"
    curl  -s http://localhost:3000/chat/channel/?search=tester -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channel/?search=bad"
    curl  -s http://localhost:3000/chat/channel/?search=bad -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channel/?search=tester"
    curl  -s http://localhost:3000/chat/channel/?search=tester -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channel/tester"
    curl  -s http://localhost:3000/chat/channel/tester -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""

    echo "GET chat/channel/bad"
    curl  -s http://localhost:3000/chat/channel/bad -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $1" -X GET | jq
    echo ""
fi