import Link from "next/link";




export default function Dashboard() {
  return (
    <>
      <section>
        <div className="content">
          <div className="text-center">
            <h1>The Dashboard!</h1>
            <p>Here is all the info and access</p>
            <ul>
              <li>
                <Link href="./dashboard/add-project">
                  <button>
                    Add Project
                  </button>
                </Link>
              </li>
              <li>
                <Link href="./dashboard/add-certification">
                  <button>
                    Add Certificate
                  </button>
                </Link>
              </li>
            </ul>

          </div>
        </div>
      </section>
    </>
  )
}
