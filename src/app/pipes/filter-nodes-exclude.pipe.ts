import { Pipe, PipeTransform } from '@angular/core';
import { GraphicNode } from '../classes/graphic-node';

@Pipe({
  name: 'filterNodesExclude',
  pure: false
})
export class FilterNodesExcludePipe implements PipeTransform {

  transform(nodes: GraphicNode[], node:  GraphicNode): GraphicNode[] {
    return nodes.filter(n => n != node);
  }

}
