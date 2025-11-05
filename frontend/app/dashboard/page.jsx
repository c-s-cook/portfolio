import Link from "next/link";
import './Dashboard.css'
import ListProjects from "../components/ListProjects/ListProjects";
import ListCertifications from "../components/ListCertifications/ListCertifications";
import SystemMetrics from "../components/SystemMetrics/SystemMetrics";



export default function Dashboard() {
  return (
    <>
      <section>
        <div className="content deck">
          <div className="text-center header">
            <h1>The Dashboard!</h1>
            <p>Here is all the info and access</p>
          </div>

          <div className="card add">
            <h3>Add New</h3>

                <Link href="./dashboard/add-project">
                  <button>
                    Add Project
                  </button>
                </Link>

                <Link href="./dashboard/add-certification">
                  <button>
                    Add Certificate
                  </button>
                </Link>

          </div>

          <div className="card projects">
            <h3>Projects</h3>
            <ul>
              <ListProjects/>
            </ul>
          </div>

          <div className="card metrics">
            <h3>METRICS</h3>
            <SystemMetrics/>

          </div>
          <div className="card certifications">
            <h3>Certifications</h3>
            <ul><ListCertifications/></ul>

          </div>

        </div>
      </section>
    </>
  )
}
