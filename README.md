# MathPlan - Math Course Management System

MathPlan is a Node.js web application developed to streamline the management of mathematics courses at TU Darmstadt. It simplifies the submission and approval of student's examination plans. It also allows members of the study office of mathematics to enter or modify data, such as courses/modules and examination regulations.

## Table of Contents

- [MathPlan - Math Course Management System](#mathplan---math-course-management-system)
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

   *MySQL:*
   Set up a MySQL database (follow online tutorial) and update the connection string in the `.env` file.
   Locally, create a database with name as specified in `.env` file, or else update the `.env` file.

   *SQLite:*
   A sqlite file should be generated automatically. It has the name (And path) as specified in database.js.

   *Scheme changes:*
   Whenever there are changes in the scheme of tables (in Sequelize), change line
   ```bash
   db.sequelize.sync()
   ```
   to
   ```bash
   db.sequelize.sync({force: true})
   ```
   in app.js. Otherwise, the database still works with the old scheme and errors might occure. **CAREFULL, this will delete all entries in the database.**
   Do not forget to redo this change after you have started the application once (if you want to keep your database content).
   For sqlite, you can alternatively simply delete the sqlite file in your file manager (please not while running the application).

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

- **Start the application:** 
  ```bash
  node app.js
  ```
  Works propely only when application is already built, i.e. the build command was run and no changes in the frontend occured afterwards.
  This command starts the application much faster than the other commands.

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
  Install Husky, which runs ESLint and Jest before each commit.

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

## Usage

- **Student Submission:**
  Students can log in and fill in the examination plan. They are also supposed to be able to alter and submit their examination plans and see fedback that was given on their submissions.

- **Instructor Management:**
  Instructors are supposed to be able to log in, choose courses they want to teach, and specify room preferences for examinations.
  So far, they can only log in.
- **Admin Dashboard:**
  Admins have access to a dashboard for managing courses and examination regulation. They are also supposed to be able to review as well as export examination plans.

## Contributing

We welcome contributions from the community! If you'd like to contribute to Materno, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature`.
3. Commit your changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

Please ensure that your code follows the project's coding standards and includes relevant tests.

## License

MathPlan is open-source software licensed under the [GPL v3](LICENSE).
