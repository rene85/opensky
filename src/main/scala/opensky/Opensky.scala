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
        div(cls:="grid grid-cols-3 gap-4 m-4",
        div(cls:="border-solid border-2 border-indigo-100 rounded-lg",
          table(cls:="border-collapse w-full",
            thead(cls:="bg-indigo-100",
              tr(
                th("Top countries of origin (Scala.js)")
              )
            ),
            tbody(
              children <-- countriesVar.signal.map(countries =>
                  countries.map(country => tr(cls:="border-t border-indigo-100",td(cls:="p-2",country)))
              )
            )
          )
        )
        )

@JSExportTopLevel("bridge")
object Bridge:
    @JSExport
    def countriesOfOrigin(countries: js.Array[String]): Unit =
        countriesVar.update(_ => countries.toSeq)
