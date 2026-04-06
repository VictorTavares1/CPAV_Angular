<!DOCTYPE html>
<html>
<body>
    <input id="email" placeholder="email"><br>
    <input id="password" placeholder="password"><br>
    <button onclick="testar()">Testar Login</button>
    <pre id="resposta"></pre>

    <script>
        function testar() {
            fetch('http://localhost/CPAV_api/api/controllers/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                })
            })
            .then(r => r.json())
            .then(data => document.getElementById('resposta').textContent = JSON.stringify(data, null, 2));
        }
    </script>
</body>
</html>