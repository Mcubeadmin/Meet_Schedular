export default function About() {
  return (
    <div style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <h1>About Event Planner</h1>
      <p>
        Create schedule and agenda for your events such as seminars, lectures,
        or meetings and collaborate with ease.
      </p>

      <section style={{ marginTop: "2rem" }}>
        <h2>What is Event Planner?</h2>
        <p>
          Event Planner (Meet_Schedular) is a lightweight scheduling application
          that simplifies meeting and event planning. It centralizes event
          creation, invitations, and time-zone aware scheduling so teams and
          individuals can coordinate without the back-and-forth.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Key Components</h2>
        <ul>
          <li>
            <strong>Frontend</strong> — User interface for creating and managing
            events
          </li>
          <li>
            <strong>Backend</strong> — APIs and business logic for persistence,
            users, and invitations
          </li>
          <li>
            <strong>Python utilities</strong> — Helper scripts for automation,
            import/export, and maintenance
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Features</h2>
        <ul>
          <li>Create, edit, and delete meetings</li>
          <li>Invite attendees and manage RSVPs</li>
          <li>Support for recurring events</li>
          <li>Time zone–aware scheduling</li>
          <li>Responsive, easy-to-use UI</li>
          <li>Modular architecture for easy extension</li>
        </ul>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>How it works (high level)</h2>
        <ol>
          <li>
            The frontend lets users create and manage events and invitations.
          </li>
          <li>The backend exposes API endpoints to persist and manage data.</li>
          <li>
            Python utilities provide scripts for admin tasks, data import/export,
            or integrations.
          </li>
        </ol>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Getting started</h2>
        <p>
          Clone the repository and follow the READMEs in the <code>frontend</code>
          , <code>backend</code>, and <code>py_files</code> directories to run
          locally:
        </p>
        <pre style={{ background: "#f6f8fa", padding: "0.75rem" }}>
          <code>git clone https://github.com/Mcubeadmin/Meet_Schedular.git</code>
        </pre>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Contributing</h2>
        <p>
          Contributions are welcome — fork the repo, create a branch, add tests
          or docs as needed, and open a pull request. Report bugs or request
          features via the repository issues.
        </p>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Contact & Support</h2>
        <p>
          For questions or support, open an issue on GitHub:{' '}
          <a
            href="https://github.com/Mcubeadmin/Meet_Schedular/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project Issues
          </a>
          .
        </p>
      </section>
    </div>
  );
}