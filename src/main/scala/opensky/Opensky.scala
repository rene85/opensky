package opensky

import org.scalajs.dom

import com.raquo.laminar.api.L.{*, given}

@main
def LiveChart(): Unit =
    renderOnDomContentLoaded(
      dom.document.getElementById("scala-root"),
      Main.appElement()
    )

object Main:
    def appElement(): Element =
        div(
          h1("Hello Laminar!"),
          div(className := "card", counterButton())
        )

def counterButton(): Element =
    val counter = Var(0)
    button(
      tpe := "button",
      "count is ",
      child.text <-- counter,
      onClick --> { event => counter.update(c => c + 1) }
    )
