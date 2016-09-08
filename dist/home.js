function setHeaderElementsPinned(e){for(var t=[elem.headerTitle,elem.laptop],o=0;o<t.length;o++)t[o].style.position=e?"fixed":"absolute",t[o].style.top=e?"50vh":window.innerHeight+"px"}function updateHeaderElements(e){function t(t,o){return t+(o-t)*e}whRatio=elem.laptopContent.offsetWidth/elem.laptopContent.offsetHeight,elem.header.style.width=t(100,100*elem.laptopContent.offsetWidth/window.innerWidth)+"vw",elem.header.style.height=t(100*(window.innerHeight/window.innerWidth),100*elem.laptopContent.offsetWidth/window.innerWidth/whRatio)+"vw",elem.header.style.top=(e<1?t(window.innerHeight/2,window.innerHeight/2-elem.laptopBase.offsetHeight/2):window.innerHeight-elem.laptopBase.offsetHeight/2)+"px",elem.header.style.position=e<1?"fixed":"absolute",elem.downIndicator.style.opacity=1-e,elem.headerTitle.style.fontSize=t(5,4)+"vw";var o=(gol.canvas.offsetWidth/window.innerWidth+gol.canvas.offsetHeight/window.innerHeight)/2;gol.idealCellSize=20*o,gol.sizeChanged()}document.addEventListener("DOMContentLoaded",function(){window.gol={cellColor:"#37474f",canvas:document.getElementById("gol"),ctx:document.getElementById("gol").getContext("2d"),fps:15,idealCellSize:20,cellSize:[20,20],boardSize:[10,10],board:void 0,_getBlankBoard:function(){for(var e=[],t=0;t<this.boardSize[0];t++)e.push(new Array(this.boardSize[1]).fill(!1));return e},sizeChanged:function(){var e,t,o=gol.canvas.offsetWidth,n=gol.canvas.offsetHeight;gol.canvas.setAttribute("width",o),gol.canvas.setAttribute("height",n),gol.cellSize=[o/Math.round(o/gol.idealCellSize),n/Math.round(n/gol.idealCellSize)];var i=gol.boardSize;gol.boardSize=[Math.round(o/gol.cellSize[0]),Math.round(n/gol.cellSize[1])];var r=[gol.boardSize[0]-i[0],gol.boardSize[1]-i[1]];if(r[0]<0&&(gol.board=gol.board.slice(0,gol.boardSize[0])),r[1]<0)for(e=0;e<gol.board.length;e++)gol.board[e]=gol.board[e].slice(0,gol.boardSize[1]);for(e=0;e<r[0];e++){for(newRow=new Array(gol.boardSize[0]).fill(!1),t=0;t<newRow.length;t++)newRow[t]=Math.random()<.125;gol.board.push(newRow)}for(e=0;e<r[1];e++)for(t=0;t<gol.board.length;t++)gol.board[t].push(Math.random()<.125);gol.redraw()},randomize:function(){for(var e=this.boardSize[0],t=this.boardSize[1],o=0;o<e;o++)for(var n=0;n<t;n++)this.board[o][n]=Math.random()<.125},redraw:function(){var e=this.canvas.getAttribute("width"),t=this.canvas.getAttribute("height");this.ctx.clearRect(0,0,e,t),this.ctx.fillStyle=this.cellColor;for(var o=0;o<this.boardSize[0];o++)for(var n=0;n<this.boardSize[1];n++)this.board[o][n]&&this.ctx.fillRect(this.cellSize[0]*o,this.cellSize[1]*n,this.cellSize[0],this.cellSize[1])},countLiveNeighbors:function(e,t){total=0,xroomneg=e>0,yroomneg=t>0,xroompos=e<this.boardSize[0]-1,yroompos=t<this.boardSize[1]-1,neighbors=[yroomneg&&this.board[e][t-1],xroompos&&yroomneg&&this.board[e+1][t-1],xroompos&&this.board[e+1][t],xroompos&&yroompos&&this.board[e+1][t+1],yroompos&&this.board[e][t+1],xroomneg&&yroompos&&this.board[e-1][t+1],xroomneg&&this.board[e-1][t],xroomneg&&yroompos&&this.board[e-1][t-1]];for(var o=0;o<neighbors.length;o++)total+=neighbors[o];return total},judgeFate:function(e,t){return e?2===t||3===t:3===t},step:function(){newState=this._getBlankBoard();for(var e=0;e<this.boardSize[0];e++)for(var t=0;t<this.boardSize[1];t++)newState[e][t]=this.judgeFate(this.board[e][t],this.countLiveNeighbors(e,t));this.board=newState},interacted:function(e){var t=gol.canvas.getBoundingClientRect(),o=e.clientX,n=e.clientY;if(o>t.left&&n>t.top&&o<t.right&&n<t.bottom){var i=o-t.left,r=n-t.top,a=Math.floor(i/gol.cellSize[0]),l=Math.floor(r/gol.cellSize[1]);gol.board[a][l]=!0}},start:function(){gol.step(),gol.redraw(),setTimeout(function(){requestAnimationFrame(gol.start)},1e3/gol.fps)},init:function(){this.board=this._getBlankBoard(),this.sizeChanged(),this.board=this._getBlankBoard(),this.randomize(),this.start()}},window.addEventListener("resize",gol.sizeChanged),document.addEventListener("mousemove",gol.interacted),gol.init()});var elem={body:document.body,header:document.getElementsByTagName("header")[0],headerTitle:document.getElementsByTagName("h1")[0],downIndicator:document.getElementsByClassName("down-indicator")[0],laptop:document.getElementsByClassName("laptop")[0],laptopContent:document.getElementsByClassName("laptop-content")[0],laptopBase:document.getElementsByClassName("laptop-base")[0]};document.addEventListener("scroll",function(e){var t=window.scrollY,o=t/(window.innerHeight/2);switch(!0){case t<5:setHeaderElementsPinned(!0),updateHeaderElements(0);break;case t<window.innerHeight/2:setHeaderElementsPinned(!0),updateHeaderElements(o);break;default:setHeaderElementsPinned(!1),updateHeaderElements(1)}}),document.addEventListener("DOMContentLoaded",function(){window.typewriter={element:document.getElementById("typewriter"),contents:["I write code. ","I write software. ","I write websites.","I write apps. ","I write libraries. ","I write simulations. ","I design experiences. ","I design interfaces. "],contentIndex:0,typingDelay:[50,100],_commonStart:function(e,t){for(var o=e.split(" "),n=t.split(" "),i=[],r=0;r<o.length;r++){if(o[r]!==n[r])return i.join(" ");i.push(o[r])}},_transitionDescription:function(e,t){var o=this._commonStart(e,t),n=e.length-o.length,i=t.slice(o.length);return{del:n,add:i}},_getTypingDelay:function(){return Math.floor(Math.random()*(this.typingDelay[1]-this.typingDelay[0])+this.typingDelay[0])},backspace:function(e,t){var o,n=e;t=t||function(){},this._backspace1=function(){0===n?t():(o=this.element.textContent,this.element.textContent=o.slice(0,o.length-1),n--,setTimeout(function(){typewriter._backspace1()},this._getTypingDelay()))},this._backspace1()},type:function(e,t){var o=0;t=t||function(){},this._type1=function(){o===e.length?t():(this.element.textContent+=e[o],o++,setTimeout(function(){typewriter._type1()},1.5*this._getTypingDelay()))},this._type1()},next:function(e){this.contentIndex++,this.contentIndex===this.contents.length&&(this.contentIndex=0);var t=this._transitionDescription(this.element.textContent,this.contents[this.contentIndex]);this.backspace(t.del,function(){setTimeout(function(){typewriter.type(t.add,e)},200)})},init:function(){function e(){typewriter._startOnScroll()}this.element.textContent=this.contents[0],this._startOnScroll=function(){window.scrollY+window.innerHeight>this.element.offsetTop+this.element.offsetHeight/2&&(setTimeout(function(){typewriter.play()},1e3),window.removeEventListener("scroll",e))},window.addEventListener("scroll",e)},play:function(){this.next(function(){setTimeout(function(){typewriter.play()},3e3)})}},typewriter.init()});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiLCJnb2wuanMiLCJ0eXBld3JpdGVyLmpzIl0sIm5hbWVzIjpbInNldEhlYWRlckVsZW1lbnRzUGlubmVkIiwiZml4ZWQiLCJlbGVtZW50cyIsImVsZW0iLCJoZWFkZXJUaXRsZSIsImxhcHRvcCIsImkiLCJsZW5ndGgiLCJzdHlsZSIsInBvc2l0aW9uIiwidG9wIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJ1cGRhdGVIZWFkZXJFbGVtZW50cyIsInByb2dyZXNzIiwidHdlZW4iLCJhIiwiYiIsIndoUmF0aW8iLCJsYXB0b3BDb250ZW50Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJoZWFkZXIiLCJ3aWR0aCIsImlubmVyV2lkdGgiLCJoZWlnaHQiLCJsYXB0b3BCYXNlIiwiZG93bkluZGljYXRvciIsIm9wYWNpdHkiLCJmb250U2l6ZSIsImNhbnZhc1NjYWxlIiwiZ29sIiwiY2FudmFzIiwiaWRlYWxDZWxsU2l6ZSIsInNpemVDaGFuZ2VkIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiY2VsbENvbG9yIiwiZ2V0RWxlbWVudEJ5SWQiLCJjdHgiLCJnZXRDb250ZXh0IiwiZnBzIiwiY2VsbFNpemUiLCJib2FyZFNpemUiLCJib2FyZCIsInVuZGVmaW5lZCIsIl9nZXRCbGFua0JvYXJkIiwiYXJyYXkiLCJ0aGlzIiwicHVzaCIsIkFycmF5IiwiZmlsbCIsImsiLCJzZXRBdHRyaWJ1dGUiLCJNYXRoIiwicm91bmQiLCJvbGRCb2FyZFNpemUiLCJkaWZmIiwic2xpY2UiLCJuZXdSb3ciLCJyYW5kb20iLCJyZWRyYXciLCJyYW5kb21pemUiLCJ4IiwieSIsImdldEF0dHJpYnV0ZSIsImNsZWFyUmVjdCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwiY291bnRMaXZlTmVpZ2hib3JzIiwidG90YWwiLCJ4cm9vbW5lZyIsInlyb29tbmVnIiwieHJvb21wb3MiLCJ5cm9vbXBvcyIsIm5laWdoYm9ycyIsImp1ZGdlRmF0ZSIsImlzTGl2ZSIsImxpdmVOZWlnaGJvcnMiLCJzdGVwIiwibmV3U3RhdGUiLCJpbnRlcmFjdGVkIiwiZSIsImJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJhYnN4IiwiY2xpZW50WCIsImFic3kiLCJjbGllbnRZIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwicmVseCIsInJlbHkiLCJjZWxseCIsImZsb29yIiwiY2VsbHkiLCJzdGFydCIsInNldFRpbWVvdXQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJpbml0IiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInNjcm9sbCIsInNjcm9sbFkiLCJoZWFkZXJQcm9ncmVzcyIsInR5cGV3cml0ZXIiLCJlbGVtZW50IiwiY29udGVudHMiLCJjb250ZW50SW5kZXgiLCJ0eXBpbmdEZWxheSIsIl9jb21tb25TdGFydCIsImFXb3JkcyIsInNwbGl0IiwiYldvcmRzIiwiY29tbW9uV29yZHMiLCJqb2luIiwiX3RyYW5zaXRpb25EZXNjcmlwdGlvbiIsImNvbW1vbiIsIm51bUNoYXJhY3RlcnNUb0RlbGV0ZSIsImNoYXJhY3RlcnNUb0FkZCIsImRlbCIsImFkZCIsIl9nZXRUeXBpbmdEZWxheSIsImJhY2tzcGFjZSIsIm51bSIsImNhbGxiYWNrIiwiY29udGVudCIsInRvR28iLCJfYmFja3NwYWNlMSIsInRleHRDb250ZW50IiwidHlwZSIsInRleHQiLCJfdHlwZTEiLCJuZXh0IiwiY2hhbmdlc05lZWRlZCIsInNjcm9sbEZ1bmMiLCJfc3RhcnRPblNjcm9sbCIsIm9mZnNldFRvcCIsInBsYXkiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiQUFzQkEsUUFBQUEseUJBQUFDLEdBRUEsSUFBQSxHQURBQyxJQUFBQyxLQUFBQyxZQUFBRCxLQUFBRSxRQUNBQyxFQUFBLEVBQUFBLEVBQUFKLEVBQUFLLE9BQUFELElBQ0FKLEVBQUFJLEdBQUFFLE1BQUFDLFNBQUFSLEVBQUEsUUFBQSxXQUNB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LEtBQUEsU0FBQUMsRUFBQU4sR0FDQSxHQUFBekgsR0FBQSxDQUNBeUgsR0FBQUEsR0FBQSxhQUNBL0UsS0FBQXNGLE9BQUEsV0FDQWhJLElBQUErSCxFQUFBOUgsT0FDQXdILEtBRUEvRSxLQUFBNEQsUUFBQXVCLGFBQUFFLEVBQUEvSCxHQUNBQSxJQUNBNEYsV0FBQSxXQUFBUyxXQUFBMkIsVUFBQSxJQUFBdEYsS0FBQTRFLHFCQUdBNUUsS0FBQXNGLFVBSUFDLEtBQUEsU0FBQVIsR0FDQS9FLEtBQUE4RCxlQUVBOUQsS0FBQThELGVBQUE5RCxLQUFBNkQsU0FBQXRHLFNBQ0F5QyxLQUFBOEQsYUFBQSxFQUdBLElBQUEwQixHQUFBeEYsS0FBQXNFLHVCQUNBdEUsS0FBQTRELFFBQUF1QixZQUNBbkYsS0FBQTZELFNBQUE3RCxLQUFBOEQsY0FFQTlELE1BQUE2RSxVQUFBVyxFQUFBZCxJQUFBLFdBQ0F4QixXQUFBLFdBQUFTLFdBQUF5QixLQUFBSSxFQUFBYixJQUFBSSxJQUFBLFFBT0EzQixLQUFBLFdBV0EsUUFBQXFDLEtBQ0E5QixXQUFBK0IsaUJBWEExRixLQUFBNEQsUUFBQXVCLFlBQUFuRixLQUFBNkQsU0FBQSxHQUNBN0QsS0FBQTBGLGVBQUEsV0FFQS9ILE9BQUE4RixRQUFBOUYsT0FBQUMsWUFDQW9DLEtBQUE0RCxRQUFBK0IsVUFBQTNGLEtBQUE0RCxRQUFBdkYsYUFBQSxJQUVBNkUsV0FBQSxXQUFBUyxXQUFBaUMsUUFBQSxLQUNBakksT0FBQWtJLG9CQUFBLFNBQUFKLEtBTUE5SCxPQUFBeUIsaUJBQUEsU0FBQXFHLElBSUFHLEtBQUEsV0FDQTVGLEtBQUF1RixLQUFBLFdBQ0FyQyxXQUFBLFdBQ0FTLFdBQUFpQyxRQUNBLFNBTUFqQyxXQUFBUCIsImZpbGUiOiJob21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWFnaWMgc2Nyb2xsIHRoaW5ncy5cbi8vIFRoaXMgYmluZHMgY29vbCBhbmltYXRpb25zIHRvIHRoZSBzY3JvbGwgbGV2ZWwgaW4gc3VjaCBhIHdheSB0aGF0IHRoZVxuLy8gYW5pbWF0aW9ucycgcHJvZ3Jlc3MgY2FuIGJlIGNvbnRyb2xsZWQgYnkgc2Nyb2xsaW5nLiBUaGlzIGRvZXMgd2hhdFxuLy8gU2Nyb2xsTWFnaWMgZG9lcyBleGNlcHQgd2l0aG91dCB0aGUgYnVncy5cblxuXG52YXIgZWxlbSA9IHtcbiAgYm9keTogZG9jdW1lbnQuYm9keSxcblxuICBoZWFkZXI6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZGVyXCIpWzBdLFxuICBoZWFkZXJUaXRsZTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoMVwiKVswXSxcbiAgZG93bkluZGljYXRvcjogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImRvd24taW5kaWNhdG9yXCIpWzBdLFxuXG4gIGxhcHRvcDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxhcHRvcFwiKVswXSxcbiAgbGFwdG9wQ29udGVudDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxhcHRvcC1jb250ZW50XCIpWzBdLFxuICBsYXB0b3BCYXNlOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGFwdG9wLWJhc2VcIilbMF1cbn07XG5cblxuLy8gSEVBREVSIFRSQU5TSVRJT04gTE9HSUMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbmZ1bmN0aW9uIHNldEhlYWRlckVsZW1lbnRzUGlubmVkKGZpeGVkKSB7XG4gIHZhciBlbGVtZW50cyA9IFtlbGVtLmhlYWRlclRpdGxlLCBlbGVtLmxhcHRvcF07XG4gIGZvciAodmFyIGk9MDsgaTxlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGVsZW1lbnRzW2ldLnN0eWxlLnBvc2l0aW9uID0gZml4ZWQgPyBcImZpeGVkXCIgOiBcImFic29sdXRlXCI7XG4gICAgZWxlbWVudHNbaV0uc3R5bGUudG9wID0gZml4ZWQgPyBcIjUwdmhcIiA6IHdpbmRvdy5pbm5lckhlaWdodCArIFwicHhcIjtcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVIZWFkZXJFbGVtZW50cyhwcm9ncmVzcykge1xuXG4gIGZ1bmN0aW9uIHR3ZWVuKGEsIGIpIHtcbiAgICByZXR1cm4gYSArIChiIC0gYSkgKiBwcm9ncmVzcztcbiAgfVxuXG4gIC8vIEZJVCBNQUlOIEhFQURFUiBUTyBMQVBUT1AgU0NSRUVOXG5cbiAgd2hSYXRpbyA9IGVsZW0ubGFwdG9wQ29udGVudC5vZmZzZXRXaWR0aCAvIGVsZW0ubGFwdG9wQ29udGVudC5vZmZzZXRIZWlnaHQ7XG4gIGVsZW0uaGVhZGVyLnN0eWxlLndpZHRoID0gdHdlZW4oXG4gICAgMTAwLFxuICAgICgxMDAgKiBlbGVtLmxhcHRvcENvbnRlbnQub2Zmc2V0V2lkdGggLyB3aW5kb3cuaW5uZXJXaWR0aClcbiAgKSArIFwidndcIjtcbiAgZWxlbS5oZWFkZXIuc3R5bGUuaGVpZ2h0ID0gdHdlZW4oXG4gICAgMTAwICogKHdpbmRvdy5pbm5lckhlaWdodCAvIHdpbmRvdy5pbm5lcldpZHRoKSxcbiAgICAoMTAwICogZWxlbS5sYXB0b3BDb250ZW50Lm9mZnNldFdpZHRoIC8gd2luZG93LmlubmVyV2lkdGgpIC8gd2hSYXRpb1xuICApICsgXCJ2d1wiO1xuICBlbGVtLmhlYWRlci5zdHlsZS50b3AgPSAocHJvZ3Jlc3MgPCAxID9cbiAgICB0d2Vlbih3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyIC0gZWxlbS5sYXB0b3BCYXNlLm9mZnNldEhlaWdodCAvIDIpIDpcbiAgICB3aW5kb3cuaW5uZXJIZWlnaHQgLSBlbGVtLmxhcHRvcEJhc2Uub2Zmc2V0SGVpZ2h0IC8gMikgK1xuICBcInB4XCI7XG4gIGVsZW0uaGVhZGVyLnN0eWxlLnBvc2l0aW9uID0gcHJvZ3Jlc3MgPCAxID8gXCJmaXhlZFwiIDogXCJhYnNvbHV0ZVwiO1xuXG4gIC8vIERFQUwgV0lUSCBBU1NPQ0lBVEVEIFRJREJJVFNcblxuICBlbGVtLmRvd25JbmRpY2F0b3Iuc3R5bGUub3BhY2l0eSA9IDEgLSBwcm9ncmVzczsgIC8vIEZhZGUgb3V0IGRvd24gaW5kaWNhdG9yXG4gIGVsZW0uaGVhZGVyVGl0bGUuc3R5bGUuZm9udFNpemUgPSB0d2Vlbig1LCA0KSArIFwidndcIjsgIC8vIFNocmluayBoZWFkZXJcblxuICAvLyBBREpVU1QgQ0FOVkFTIFNFVFRJTkdTXG5cbiAgLy8gTWVhbiBvZiBYIHNjYWxlIGRpZmZlcmVuY2UgYW5kIFkgc2NhbGUgZGlmZmVyZW5jZVxuICB2YXIgY2FudmFzU2NhbGUgPSAoZ29sLmNhbnZhcy5vZmZzZXRXaWR0aCAvIHdpbmRvdy5pbm5lcldpZHRoICsgZ29sLmNhbnZhcy5vZmZzZXRIZWlnaHQgLyB3aW5kb3cuaW5uZXJIZWlnaHQpIC8gMjtcbiAgZ29sLmlkZWFsQ2VsbFNpemUgPSAyMCAqIGNhbnZhc1NjYWxlO1xuICBnb2wuc2l6ZUNoYW5nZWQoKTtcbn1cblxuXG5cbi8vIFNDUk9MTCBMSVNURU5FUiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZnVuY3Rpb24oZSkge1xuICB2YXIgc2Nyb2xsID0gd2luZG93LnNjcm9sbFk7XG5cbiAgLy8gSGVhZGVyXG5cbiAgdmFyIGhlYWRlclByb2dyZXNzID0gc2Nyb2xsIC8gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuXG4gIHN3aXRjaCh0cnVlKSB7XG4gICAgY2FzZSAoc2Nyb2xsIDwgNSk6XG4gICAgICBzZXRIZWFkZXJFbGVtZW50c1Bpbm5lZCh0cnVlKTtcbiAgICAgIHVwZGF0ZUhlYWRlckVsZW1lbnRzKDApO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIChzY3JvbGwgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKTpcbiAgICAgIHNldEhlYWRlckVsZW1lbnRzUGlubmVkKHRydWUpO1xuICAgICAgdXBkYXRlSGVhZGVyRWxlbWVudHMoaGVhZGVyUHJvZ3Jlc3MpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgc2V0SGVhZGVyRWxlbWVudHNQaW5uZWQoZmFsc2UpO1xuICAgICAgdXBkYXRlSGVhZGVyRWxlbWVudHMoMSk7XG4gIH1cbn0pO1xuIiwiLyogQ29ud2F5J3MgR2FtZSBvZiBMaWZlICovXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgd2luZG93LmdvbCA9IHtcblxuXG4gICAgLy8gQkFTSUMgQVRUUklCVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBjZWxsQ29sb3I6IFwiIzM3NDc0ZlwiLFxuICAgIGNhbnZhczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnb2xcIiksXG4gICAgY3R4OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdvbFwiKS5nZXRDb250ZXh0KFwiMmRcIiksXG5cbiAgICBmcHM6IDE1LFxuXG4gICAgaWRlYWxDZWxsU2l6ZTogMjAsXG4gICAgY2VsbFNpemU6IFsyMCwgMjBdLCAvLyBUaGlzIGdldHMgdXBkYXRlZCBkeW5hbWljYWxseS5cblxuICAgIGJvYXJkU2l6ZTogWzEwLCAxMF0sXG5cbiAgICBib2FyZDogdW5kZWZpbmVkLFxuXG5cbiAgICAvLyBIRUxQRVIgRlVOQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgX2dldEJsYW5rQm9hcmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICBmb3IgKHZhciBpPTA7IGk8dGhpcy5ib2FyZFNpemVbMF07IGkrKykge1xuICAgICAgICBhcnJheS5wdXNoKFxuICAgICAgICAgIG5ldyBBcnJheSh0aGlzLmJvYXJkU2l6ZVsxXSkuZmlsbChmYWxzZSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9LFxuXG5cbiAgICAvLyBSRU5ERVJJTkcgRlVOQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBUaGVzZSBmdW5jdGlvbnMgY29ubmVjdCB0aGUgc2ltdWxhdGlvbiB0byB0aGUgYnJvd3NlclxuXG5cbiAgICAvLyBDYWxsZWQgdG8gdXBkYXRlIHRoZSBnYW1lIGlmIHRoZSBjYW52YXMgc2l6ZVxuICAgIC8vIGNoYW5nZXMuXG5cbiAgICBzaXplQ2hhbmdlZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSwgaywgIC8vIFNwYXJlIGxvb3AgdmFyaWFibGVzXG4gICAgICAgICAgd2lkdGggPSBnb2wuY2FudmFzLm9mZnNldFdpZHRoLFxuICAgICAgICAgIGhlaWdodCA9IGdvbC5jYW52YXMub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAvLyBVcGRhdGUgY2FudmFzIGNvb3JkaW5hdGUgc3lzdGVtXG4gICAgICBnb2wuY2FudmFzLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIHdpZHRoKTtcbiAgICAgIGdvbC5jYW52YXMuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aWxlIHNpemUgYnkgZmluZGluZyBhIHdpZHRoIHRoYXQgd2lsbFxuICAgICAgLy8gZXZlbmx5IGZpbGwgdGhlIGNhbnZhcyBhbmQgaXMgY2xvc2VzdCB0byB0aGVcbiAgICAgIC8vIGlkZWFsQ2VsbFNpemUsIHRoZW4gZG9pbmcgdGhlIHNhbWUgdGhpbmcgZm9yXG4gICAgICAvLyBoZWlnaHQuXG5cbiAgICAgIGdvbC5jZWxsU2l6ZSA9IFtcbiAgICAgICAgd2lkdGggLyBNYXRoLnJvdW5kKHdpZHRoIC8gZ29sLmlkZWFsQ2VsbFNpemUpLFxuICAgICAgICBoZWlnaHQgLyBNYXRoLnJvdW5kKGhlaWdodCAvIGdvbC5pZGVhbENlbGxTaXplKVxuICAgICAgXTtcblxuICAgICAgLy8gV2hlbiBib2FyZCBzaXplIGNoYW5nZXMsIGtpbGwgY2VsbHMgdGhhdCBhcmVcbiAgICAgIC8vIGN1dCBvZmYgYW5kIHJhbmRvbWl6ZSBuZXcgdGVycmFpbi5cblxuICAgICAgdmFyIG9sZEJvYXJkU2l6ZSA9IGdvbC5ib2FyZFNpemU7ICAvLyBTdG9yZSBvbGQgc2l6ZVxuICAgICAgZ29sLmJvYXJkU2l6ZSA9IFsgIC8vIEFkanVzdCBzaXplXG4gICAgICAgIE1hdGgucm91bmQod2lkdGggLyBnb2wuY2VsbFNpemVbMF0pLFxuICAgICAgICBNYXRoLnJvdW5kKGhlaWdodCAvIGdvbC5jZWxsU2l6ZVsxXSlcbiAgICAgIF07XG4gICAgICB2YXIgZGlmZiA9IFsgIC8vIENhbGN1bGF0ZSBzaXplIGRpZmZlcmVuY2VcbiAgICAgICAgZ29sLmJvYXJkU2l6ZVswXSAtIG9sZEJvYXJkU2l6ZVswXSxcbiAgICAgICAgZ29sLmJvYXJkU2l6ZVsxXSAtIG9sZEJvYXJkU2l6ZVsxXVxuICAgICAgXTtcblxuICAgICAgLy8gS2lsbCBkZWFkIGNlbGxzXG5cbiAgICAgIGlmIChkaWZmWzBdIDwgMCkge1xuICAgICAgICBnb2wuYm9hcmQgPSBnb2wuYm9hcmQuc2xpY2UoMCwgZ29sLmJvYXJkU2l6ZVswXSk7XG4gICAgICB9XG4gICAgICBpZiAoZGlmZlsxXSA8IDApIHtcbiAgICAgICAgZm9yIChpPTA7IGk8Z29sLmJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZ29sLmJvYXJkW2ldID0gZ29sLmJvYXJkW2ldLnNsaWNlKDAsIGdvbC5ib2FyZFNpemVbMV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFBvcHVsYXRlIG5ldyBjZWxsc1xuXG4gICAgICBmb3IgKGk9MDsgaTxkaWZmWzBdOyBpKyspIHtcbiAgICAgICAgbmV3Um93ID0gbmV3IEFycmF5KGdvbC5ib2FyZFNpemVbMF0pLmZpbGwoZmFsc2UpO1xuICAgICAgICBmb3IgKGs9MDsgazxuZXdSb3cubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBuZXdSb3dba10gPSBNYXRoLnJhbmRvbSgpIDwgMC4xMjU7XG4gICAgICAgIH1cbiAgICAgICAgZ29sLmJvYXJkLnB1c2gobmV3Um93KTtcbiAgICAgIH1cbiAgICAgIGZvciAoaT0wOyBpPGRpZmZbMV07IGkrKykge1xuICAgICAgICBmb3IgKGs9MDsgazxnb2wuYm9hcmQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBnb2wuYm9hcmRba10ucHVzaChNYXRoLnJhbmRvbSgpIDwgMC4xMjUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdvbC5yZWRyYXcoKTtcbiAgICB9LFxuXG5cbiAgICAvLyBSYW5kb21pemUgdGhlIGdhbWUgc3RhdGVcblxuICAgIHJhbmRvbWl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgd2lkdGggPSB0aGlzLmJvYXJkU2l6ZVswXSxcbiAgICAgICAgICBoZWlnaHQgPSB0aGlzLmJvYXJkU2l6ZVsxXTtcblxuICAgICAgZm9yICh2YXIgeD0wOyB4PHdpZHRoOyB4KyspIHtcbiAgICAgICAgZm9yICh2YXIgeT0wOyB5PGhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgdGhpcy5ib2FyZFt4XVt5XSA9IE1hdGgucmFuZG9tKCkgPCAwLjEyNTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIFJlbmRlciB0aGUgYm9hcmQgb24gdGhlIGNhbnZhc1xuXG4gICAgcmVkcmF3OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMuY2FudmFzLmdldEF0dHJpYnV0ZShcIndpZHRoXCIpLFxuICAgICAgICAgIGhlaWdodCA9IHRoaXMuY2FudmFzLmdldEF0dHJpYnV0ZShcImhlaWdodFwiKTtcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IHRoaXMuY2VsbENvbG9yO1xuICAgICAgLy8gUmVuZGVyIGJvYXJkXG4gICAgICBmb3IgKHZhciB4PTA7IHg8dGhpcy5ib2FyZFNpemVbMF07IHgrKykge1xuICAgICAgICBmb3IgKHZhciB5PTA7IHk8dGhpcy5ib2FyZFNpemVbMV07IHkrKykge1xuICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3hdW3ldKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdChcbiAgICAgICAgICAgICAgdGhpcy5jZWxsU2l6ZVswXSAqIHgsXG4gICAgICAgICAgICAgIHRoaXMuY2VsbFNpemVbMV0gKiB5LFxuICAgICAgICAgICAgICB0aGlzLmNlbGxTaXplWzBdLFxuICAgICAgICAgICAgICB0aGlzLmNlbGxTaXplWzFdXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIEdBTUUgTE9HSUMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cbiAgICBjb3VudExpdmVOZWlnaGJvcnM6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHRvdGFsID0gMDtcblxuICAgICAgLy8gSXMgdGhlcmUgcm9vbSBpbiBkaXJlY3Rpb25zIG9mOlxuICAgICAgLy8gICAtIG5lZ2F0aXZlIHhcbiAgICAgIC8vICAgLSBuZWdhdGl2ZSB5XG4gICAgICAvLyAgIC0gcG9zaXRpdmUgeFxuICAgICAgLy8gICAtIHBvc2l0aXZlIHlcbiAgICAgIHhyb29tbmVnID0geCA+IDA7XG4gICAgICB5cm9vbW5lZyA9IHkgPiAwO1xuICAgICAgeHJvb21wb3MgPSB4IDwgdGhpcy5ib2FyZFNpemVbMF0gLSAxO1xuICAgICAgeXJvb21wb3MgPSB5IDwgdGhpcy5ib2FyZFNpemVbMV0gLSAxO1xuXG4gICAgICBuZWlnaGJvcnMgPSBbXG4gICAgICAgIC8vIGFib3ZlXG4gICAgICAgIHlyb29tbmVnICYmIHRoaXMuYm9hcmRbeF1beS0xXSxcbiAgICAgICAgLy8gYWJvdmUgcmlnaHRcbiAgICAgICAgeHJvb21wb3MgJiYgeXJvb21uZWcgJiYgdGhpcy5ib2FyZFt4KzFdW3ktMV0sXG4gICAgICAgIC8vIHJpZ2h0XG4gICAgICAgIHhyb29tcG9zICYmIHRoaXMuYm9hcmRbeCsxXVt5XSxcbiAgICAgICAgLy8gYmVsb3cgcmlnaHRcbiAgICAgICAgeHJvb21wb3MgJiYgeXJvb21wb3MgJiYgdGhpcy5ib2FyZFt4KzFdW3krMV0sXG4gICAgICAgIC8vIGJlbG93XG4gICAgICAgIHlyb29tcG9zICYmIHRoaXMuYm9hcmRbeF1beSsxXSxcbiAgICAgICAgLy8gYmVsb3cgbGVmdFxuICAgICAgICB4cm9vbW5lZyAmJiB5cm9vbXBvcyAmJiB0aGlzLmJvYXJkW3gtMV1beSsxXSxcbiAgICAgICAgLy8gbGVmdFxuICAgICAgICB4cm9vbW5lZyAmJiB0aGlzLmJvYXJkW3gtMV1beV0sXG4gICAgICAgIC8vIGFib3ZlIGFuZCBsZWZ0XG4gICAgICAgIHhyb29tbmVnICYmIHlyb29tcG9zICYmIHRoaXMuYm9hcmRbeC0xXVt5LTFdXG4gICAgICBdO1xuICAgICAgZm9yICh2YXIgaT0wOyBpPG5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbCArPSBuZWlnaGJvcnNbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdG90YWw7XG4gICAgfSxcblxuICAgIGp1ZGdlRmF0ZTogZnVuY3Rpb24oaXNMaXZlLCBsaXZlTmVpZ2hib3JzKSB7XG4gICAgICBpZiAoaXNMaXZlKSB7XG4gICAgICAgIC8vIEFueSBsaXZlIGNlbGwgd2l0aCBmZXdlciB0aGFuIDIgbGl2ZSBuZWlnaGJvcnNcbiAgICAgICAgLy8gZGllcyBvZiB1bmRlcnBvcHVsYXRpb247IGFueSBsaXZlIGNlbGwgd2l0aCBtb3JlXG4gICAgICAgIC8vIHRoYW4gdGhyZWUgZGllcyBvZiBvdmVycG9wdWxhdGlvbi5cbiAgICAgICAgcmV0dXJuIChsaXZlTmVpZ2hib3JzID09PSAyIHx8IGxpdmVOZWlnaGJvcnMgPT09IDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQW55IGRlYWQgY2VsbCB3aXRoIGV4YWN0bHkgMyBuZWlnaGJvcnMgaXMgYm9yblxuICAgICAgICByZXR1cm4gbGl2ZU5laWdoYm9ycyA9PT0gMztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RlcDogZnVuY3Rpb24oKSB7XG4gICAgICBuZXdTdGF0ZSA9IHRoaXMuX2dldEJsYW5rQm9hcmQoKTtcblxuICAgICAgZm9yICh2YXIgeD0wOyB4PHRoaXMuYm9hcmRTaXplWzBdOyB4KyspIHtcbiAgICAgICAgZm9yICh2YXIgeT0wOyB5PHRoaXMuYm9hcmRTaXplWzFdOyB5KyspIHtcbiAgICAgICAgICBuZXdTdGF0ZVt4XVt5XSA9IHRoaXMuanVkZ2VGYXRlKFxuICAgICAgICAgICAgdGhpcy5ib2FyZFt4XVt5XSxcbiAgICAgICAgICAgIHRoaXMuY291bnRMaXZlTmVpZ2hib3JzKHgsIHkpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmJvYXJkID0gbmV3U3RhdGU7XG4gICAgfSxcblxuXG4gICAgLy8gVVNFUiBJTlRFUkFDVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIC8vIE9uIGEgZGVza3RvcCBjb21wdXRlciwgY2VsbHMgYXJlIGJvcm5cbiAgICAvLyB3aGVuIG1vdXNlZCBvdmVyLiBPbiBhIG1vYmlsZSBkZXZpY2VcbiAgICAvLyBpdCdzIHdoZXJldmVyIGEgdG91Y2ggb2NjdXJzIG9yIGlzIGRyYWdnZWQuXG4gICAgaW50ZXJhY3RlZDogZnVuY3Rpb24oZSkge1xuICAgICAgLy8gUG9zaXRpb24gb2YgdGhlIGNhbnZhcyBpbiB0aGUgdmlld3BvcnRcbiAgICAgIHZhciBiYm94ID0gZ29sLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgIC8vIFBvc2l0aW9uIG9mIHRoZSBtb3VzZSBpbiB0aGUgdmlld3BvcnRcbiAgICAgICAgICBhYnN4ID0gZS5jbGllbnRYLCBhYnN5PWUuY2xpZW50WTtcblxuICAgICAgLy8gSWYgdGhlc2UgdHdvIHBvc2l0aW9ucyBpbnRlcnNlY3Q6XG4gICAgICBpZiAoYWJzeCA+IGJib3gubGVmdCAgJiZcbiAgICAgICAgICBhYnN5ID4gYmJveC50b3AgICAmJlxuICAgICAgICAgIGFic3ggPCBiYm94LnJpZ2h0ICYmXG4gICAgICAgICAgYWJzeSA8IGJib3guYm90dG9tXG4gICAgICApIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIG1vdXNlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIGNhbnZhc1xuICAgICAgICB2YXIgcmVseCA9IGFic3ggLSBiYm94LmxlZnQsXG4gICAgICAgICAgICByZWx5ID0gYWJzeSAtIGJib3gudG9wO1xuICAgICAgICAvLyBDYWxjdWxhdGUgY2VsbCBwb3NpdGlvblxuICAgICAgICB2YXIgY2VsbHggPSBNYXRoLmZsb29yKHJlbHggLyBnb2wuY2VsbFNpemVbMF0pLFxuICAgICAgICAgICAgY2VsbHkgPSBNYXRoLmZsb29yKHJlbHkgLyBnb2wuY2VsbFNpemVbMV0pO1xuXG4gICAgICAgIGdvbC5ib2FyZFtjZWxseF1bY2VsbHldID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvLyBDT05UUk9MIEZVTkNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gICAgLy8gQmVnaW4gdGhlIGxvb3BcblxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIGdvbC5zdGVwKCk7XG4gICAgICBnb2wucmVkcmF3KCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ29sLnN0YXJ0KTtcbiAgICAgIH0sIDEwMDAgLyBnb2wuZnBzKTtcbiAgICB9LFxuXG5cbiAgICAvLyBJbml0aWFsaXplIGFuZCBiZWdpblxuXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBUZW1wb3JhcnkgYm9hcmRcbiAgICAgIHRoaXMuYm9hcmQgPSB0aGlzLl9nZXRCbGFua0JvYXJkKCk7XG4gICAgICAvLyBDYWxjdWxhdGUgc2l6ZXNcbiAgICAgIHRoaXMuc2l6ZUNoYW5nZWQoKTtcbiAgICAgIC8vIEluaXRpYWxpemUgYm9hcmRcbiAgICAgIHRoaXMuYm9hcmQgPSB0aGlzLl9nZXRCbGFua0JvYXJkKCk7XG4gICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbiAgfTtcblxuXG5cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBnb2wuc2l6ZUNoYW5nZWQpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGdvbC5pbnRlcmFjdGVkKTtcbiAgZ29sLmluaXQoKTtcblxufSk7XG4iLCIvKiBUeXBld3JpdGVyIHRleHQgYW5pbWF0aW9uICovXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcblxuICB3aW5kb3cudHlwZXdyaXRlciA9IHtcbiAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGV3cml0ZXJcIiksXG4gICAgY29udGVudHM6IFtcbiAgICAgIFwiSSB3cml0ZSBjb2RlLlxceGEwXCIsXG4gICAgICBcIkkgd3JpdGUgc29mdHdhcmUuXFx4YTBcIixcbiAgICAgIFwiSSB3cml0ZSB3ZWJzaXRlcy5cIixcbiAgICAgIFwiSSB3cml0ZSBhcHBzLlxceGEwXCIsXG4gICAgICBcIkkgd3JpdGUgbGlicmFyaWVzLlxceGEwXCIsXG4gICAgICBcIkkgd3JpdGUgc2ltdWxhdGlvbnMuXFx4YTBcIixcbiAgICAgIFwiSSBkZXNpZ24gZXhwZXJpZW5jZXMuXFx4YTBcIixcbiAgICAgIFwiSSBkZXNpZ24gaW50ZXJmYWNlcy5cXHhhMFwiLFxuICAgIF0sXG4gICAgY29udGVudEluZGV4OiAwLFxuXG4gICAgLy8gQSByYW5kb20gZGVsYXkgaW4gbXMgd2lsbCBiZSBjaG9zZW4gZnJvbSB0aGlzIHJhbmdlLiBUaGUgcmVzdWx0aW5nIGRlbGF5XG4gICAgLy8gaXMgbXVsdGlwbGllZCBmb3IgdHlwaW5nLCBzbyB0aGlzIGlzbid0IGV4YWN0LlxuICAgIHR5cGluZ0RlbGF5OiBbNTAsIDEwMF0sXG5cbiAgICAvKiBGaW5kIGNvbW1vbiB3b3JkcyB0aGF0IHR3byBzdHJpbmdzIHN0YXJ0IHdpdGguICovXG4gICAgX2NvbW1vblN0YXJ0OiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgdmFyIGFXb3JkcyA9IGEuc3BsaXQoXCIgXCIpO1xuICAgICAgdmFyIGJXb3JkcyA9IGIuc3BsaXQoXCIgXCIpO1xuXG4gICAgICB2YXIgY29tbW9uV29yZHMgPSBbXTtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxhV29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFXb3Jkc1tpXSA9PT0gYldvcmRzW2ldKSB7XG4gICAgICAgICAgY29tbW9uV29yZHMucHVzaChhV29yZHNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjb21tb25Xb3Jkcy5qb2luKFwiIFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKiBHZXQgaW5zdHJ1Y3Rpb25zIGZvciB0cmFuc2Zvcm1pbmcgYmV0d2VlbiB0d28gc3RyaW5ncyBpbiB0aGUgZm9ybSBvZlxuICAgICAqIG51bWJlciBvZiBjaGFyYWN0ZXJzIHRvIGRlbGV0ZSBhbmQgY2hhcmFjdGVycyB0byBhZGQuXG4gICAgICovXG4gICAgX3RyYW5zaXRpb25EZXNjcmlwdGlvbjogZnVuY3Rpb24oYSwgYikge1xuICAgICAgdmFyIGNvbW1vbiA9IHRoaXMuX2NvbW1vblN0YXJ0KGEsIGIpO1xuICAgICAgdmFyIG51bUNoYXJhY3RlcnNUb0RlbGV0ZSA9IGEubGVuZ3RoIC0gY29tbW9uLmxlbmd0aDtcbiAgICAgIHZhciBjaGFyYWN0ZXJzVG9BZGQgPSBiLnNsaWNlKGNvbW1vbi5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVsOiBudW1DaGFyYWN0ZXJzVG9EZWxldGUsXG4gICAgICAgIGFkZDogY2hhcmFjdGVyc1RvQWRkXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBfZ2V0VHlwaW5nRGVsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLnR5cGluZ0RlbGF5WzFdIC0gdGhpcy50eXBpbmdEZWxheVswXSkgKyB0aGlzLnR5cGluZ0RlbGF5WzBdKTtcbiAgICB9LFxuXG4gICAgLyogQW5pbWF0ZSBiYWNzcGFjaW5nIGJ5IGEgZ2l2ZW4gbnVtYmVyIG9mIGNoYXJhY3RlcnMgKi9cbiAgICBiYWNrc3BhY2U6IGZ1bmN0aW9uKG51bSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjb250ZW50LCB0b0dvID0gbnVtO1xuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgdGhpcy5fYmFja3NwYWNlMSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodG9HbyA9PT0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuZWxlbWVudC50ZXh0Q29udGVudDtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSBjb250ZW50LnNsaWNlKDAsIGNvbnRlbnQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgdG9Hby0tO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0eXBld3JpdGVyLl9iYWNrc3BhY2UxKCk7fSwgdGhpcy5fZ2V0VHlwaW5nRGVsYXkoKSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLl9iYWNrc3BhY2UxKCk7XG4gICAgfSxcblxuICAgIC8qIEFuaW1hdGUgaW5zZXJ0aW5nIGEgZ2l2ZW4gc3RyaW5nIGF0IHRoZSBlbmQgb2YgdGhlIHRleHQgKi9cbiAgICB0eXBlOiBmdW5jdGlvbih0ZXh0LCBjYWxsYmFjaykge1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuICAgICAgdGhpcy5fdHlwZTEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGkgPT09IHRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgKz0gdGV4dFtpXTtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe3R5cGV3cml0ZXIuX3R5cGUxKCk7fSwgdGhpcy5fZ2V0VHlwaW5nRGVsYXkoKSAqIDEuNSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLl90eXBlMSgpO1xuICAgIH0sXG5cbiAgICAvKiBBbmltYXRlIGFkdmFuY2luZyB0byB0aGUgbmV4dCBwaHJhc2UgKi9cbiAgICBuZXh0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdGhpcy5jb250ZW50SW5kZXgrKztcbiAgICAgIC8vIExvb3AgYmFja1xuICAgICAgaWYgKHRoaXMuY29udGVudEluZGV4ID09PSB0aGlzLmNvbnRlbnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICAvLyBNYWtlIGNoYW5nZXNcbiAgICAgIHZhciBjaGFuZ2VzTmVlZGVkID0gdGhpcy5fdHJhbnNpdGlvbkRlc2NyaXB0aW9uKFxuICAgICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQsXG4gICAgICAgIHRoaXMuY29udGVudHNbdGhpcy5jb250ZW50SW5kZXhdXG4gICAgICApO1xuICAgICAgdGhpcy5iYWNrc3BhY2UoY2hhbmdlc05lZWRlZC5kZWwsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHlwZXdyaXRlci50eXBlKGNoYW5nZXNOZWVkZWQuYWRkLCBjYWxsYmFjayk7fSwgMjAwKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiBGaWxsIHRoZSBlbGVtZW50IHdpdGggdGhlIGZpcnN0IHBocmFzZSAobm9uLWFuaW1hdGVkKSBhbmQgc2V0IHVwIG90aGVyXG4gICAgICogbWlzY2VsbGFuZW91cyBkZXRhaWxzLlxuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5lbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5jb250ZW50c1swXTtcbiAgICAgIHRoaXMuX3N0YXJ0T25TY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHdpbmRvdy5zY3JvbGxZICsgd2luZG93LmlubmVySGVpZ2h0ID5cbiAgICAgICAgICB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wICsgdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodCAvIDJcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe3R5cGV3cml0ZXIucGxheSgpO30sIDEwMDApO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNjcm9sbEZ1bmMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gc2Nyb2xsRnVuYygpIHtcbiAgICAgICAgdHlwZXdyaXRlci5fc3RhcnRPblNjcm9sbCgpO1xuICAgICAgfVxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2Nyb2xsRnVuYyk7XG4gICAgfSxcblxuICAgIC8qIFJlY3Vyc2l2ZWx5IGNvbnRpbnVlIGFkdmFuY2luZyAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5uZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHR5cGV3cml0ZXIucGxheSgpO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9O1xuXG4gIHR5cGV3cml0ZXIuaW5pdCgpO1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
