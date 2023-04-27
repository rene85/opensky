package opensky

import org.scalajs.dom

import scala.scalajs.js
import scala.scalajs.js.annotation.*

@main
def OpenSky(): Unit =
    dom.document.querySelector("#scala-root").innerHTML = s"""
    <div>
      <h1>Hello Scala.js!</h1>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
    </div>
    """

    setupCounter(dom.document.getElementById("counter"))

def setupCounter(element: dom.Element): Unit =
    var counter = 0

    def setCounter(count: Int): Unit =
        counter = count
        element.innerHTML = s"count is $counter"

    element.addEventListener("click", e => setCounter(counter + 1))
    setCounter(0)
