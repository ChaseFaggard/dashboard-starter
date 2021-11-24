import Database from "./database.js"

class Auth {

    static #bcrypt = dcodeIO.bcrypt

    static isAuthenticated = () => {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
        return new Date().getTime() < expiresAt
    }

    static logout = () => {
        localStorage.removeItem('email')
        localStorage.removeItem('expires_at')
    }

    static loginSubmit = async (e, cb) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const user = await Database.getRecord('dashboard-users', 'email', formData.get('email'))
        if(user && await this.#bcrypt.compare(formData.get('password'), user.password)) {
            this.startSession(user, 60) // Login user for 15 minutes
            cb()
        }
        else {
            const errorMsg = document.querySelector('.error')
            errorMsg.innerText = 'Email / Password did not match any user'
            errorMsg.style.display = 'block'
        }
    }

    static signupSubmit = async (e, cb) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const user = await Database.getRecord('dashboard-users', 'email', formData.get('email')) 
        if(user) {
            const errorMsg = document.querySelector('#signup-errorMsg')
            errorMsg.innerText = 'Email already taken. Try another one.'
            errorMsg.style.display = 'block'
            return
        }
        const pass = formData.get('password')
        if(pass == formData.get('password2')) {
            const hash = this.hash(pass)
            const user = {
                first_name: formData.get('firstName'),
                last_name: formData.get('lastName'),
                email: formData.get('email'),
                password: hash,
                favPlayer: '',
                location: ''
            }

            await Database.createRecord('dashboard-users',user)
            this.startSession(user, 60)
            cb()
            console.log('User created and logged in for 5 minutes')
        }
        else {
            const errorMsg = document.querySelector('#signup-errorMsg')
            errorMsg.innerText = 'Passwords do not match.'
            errorMsg.style.display = 'block'
            return
        }
    }

    static startSession = async (user, expiresIn) => {
        const expiresAt = JSON.stringify(expiresIn * 60 * 1000 + new Date().getTime())
        localStorage.setItem('email', user.email)
        localStorage.setItem('expires_at', expiresAt)
    }

    static hash = pass => {
        this.#bcrypt.hash(pass, 10, async (err, hash) => {
            if(err) {
                console.error(err)
                return
            }
            return hash
        })
    }

    static renderLoginForm = (element, cb) => {
        element.innerHTML = `
        <div class="form-container">
            <div class="form-wrap">
            <h1>LOGIN</h1>
            <form id="login-form" autocomplete="off">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required />
                    <i class="far fa-envelope"></i>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" required />
                    <i class="fas fa-key"></i>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            </div>
            <footer>
            <p>Don't have an account? <a id="signup" href="#">Signup Here</a></p>
            </footer>
            <div class="msg error" id="login-errorMsg"></div>
            <div class="msg success" id="login-successMsg"></div>
        </div>
        `
        document.querySelector('#login-form').addEventListener('submit', e => this.loginSubmit(e, cb))
        document.querySelector('#signup').addEventListener('click', e => this.renderSignupForm(element, cb))
    }

    static renderSignupForm = (element, cb) => {
        element.innerHTML = `
        <div class="form-container">
            <div class="form-wrap">
            <h1>SIGN UP</h1>
            <form id="signup-form" autocomplete="off">
                <div class="form-group">
                    <label for="first-name">First Name</label>
                    <input type="text" name="firstName" id="first-name" required />
                    <i class="fas fa-signature"></i>
                </div>
                <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text" name="lastName" id="last-name" required />
                <i class="fas fa-signature"></i>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required />
                    <i class="far fa-envelope"></i>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" required />
                    <i class="fas fa-key"></i>
                </div>
                <div class="form-group">
                    <label for="password">Confirm Password</label>
                    <input type="password" name="password2" id="password2" required />
                    <i class="fas fa-key"></i>
                </div>
                <button type="submit" class="btn">Signup</button>
            </form>
            </div>
            <footer>
            <p>Already have an account? <a id="login" href="#">Login Here</a></p>
            </footer>
            <div class="msg error" id="signup-errorMsg"></div>
            <div class="msg success" id="signup-successMsg"></div>
        </div>
        `
        document.querySelector('#signup-form').addEventListener('submit', e => this.signupSubmit(e, cb))
        document.querySelector('#login').addEventListener('click', e => this.renderLoginForm(element, cb))
    }
}

export default Auth


