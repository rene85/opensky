package opensky

import org.scalajs.dom

import com.raquo.laminar.api.L.{*, given}

import scala.scalajs.js
import scala.scalajs.js.annotation.*

val countriesVar = Var(initial = Seq[String]())

@main
def Opensky(): Unit =
    renderOnDomContentLoaded(
      dom.document.getElementById("scala-root"),
      Main.appElement()
    )

object Main:
    def appElement(): Element =
        div(
          table(
            thead(
              tr(
                th("Top countries of origin (Scala.js)")
              )
            ),
            tbody(
              children <-- countriesVar.signal.map(countries =>
                  countries.map(country => tr(td(country)))
              )
            )
          )
        )

@JSExportTopLevel("bridge")
object Bridge:
    @JSExport
    def countriesOfOrigin(countries: js.Array[String]): Unit =
        countriesVar.update(_ => countries.toSeq)
