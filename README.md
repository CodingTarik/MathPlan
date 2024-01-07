# Materno - Math Course Management System

Materno is a Node.js web application developed to streamline the management of mathematics courses at TU Darmstadt. It facilitates the submission of examination schedules by students and allows instructors to select courses and specify room preferences.

## Table of Contents

- [Materno - Math Course Management System](#materno---math-course-management-system)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Development Scripts](#development-scripts)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://git.rwth-aachen.de/tarik.azzouzi/materno.git
   cd materno
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Checkout `.env` file and configure the required variables.

4. **Database Setup:**
   Set up a MySQL database (follow online tutorial) and update the connection string in the `.env` file or use Envrioment variables (it is easier to configure MySQL according to the variables in the file (eg the password)).
   Locally create a database with name as specified in `.env` file.
   Whenever there are changes in the scheme of tables, comment in db.sequelize.sync({force: true}) in app.js and comment out the line above. CAREFULL, this will delete all entries in the database.

5. **Start the Application:**
   ```bash
   npm start
   ```

   The application will be accessible.

## Development Scripts

- **Build the Application:**
  ```bash
  npm run build
  ```
  This command builds the application for production.

- **Run the Application:**
  ```bash
  npm run start
  ```
  Start the application in development mode.

- **Linting:**
  ```bash
  npm run lint
  ```
  Check coding standards using ESLint.

- **Linting and Fixing:**
  ```bash
  npm run lint:fix
  ```
  Check and automatically fix coding standards using ESLint.

- **Prepare Husky:**
  ```bash
  npm run prepare
  ```
  Install Husky, which runs ESLint before each commit.

- **Install Husky with Jest and ESLint:**
  ```bash
  npm run installHusky
  ```
  Install Husky and initialize .husky with Jest and ESLint tests.

- **Run Tests:**
  ```bash
  npm run test
  ```
  Execute tests using Jest.

- **Format Code:**
  ```bash
  npm run format
  ```
  Format code using Prettier.

Feel free to customize the descriptions or add more details based on your project's specific setup and requirements.

## Usage

- **Student Submission:**
  Students can log in, submit their examination schedules, and view relevant information.

- **Instructor Management:**
  Instructors can log in, choose courses they want to teach, and specify room preferences for examinations.

- **Admin Dashboard:**
  Admins have access to a dashboard for managing users, courses, and other administrative tasks.

## Contributing

We welcome contributions from the community! If you'd like to contribute to Materno, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Please ensure that your code follows the project's coding standards and includes relevant tests.

## License

Materno is open-source software licensed under the [GPL v3](LICENSE). # TODO Change this


 